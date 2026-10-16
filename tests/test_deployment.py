"""Exercise the real Ubuntu deploy script with fake systemctl and HTTP responses.

No actual service or production database is touched. Run on Linux, as CI does.
"""
import fcntl
import http.server
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import unittest
import zipfile

ROOT = Path(__file__).resolve().parent.parent
SHA = "a" * 40


def make_jar(path, label):
    with zipfile.ZipFile(path, "w") as jar:
        jar.writestr("META-INF/MANIFEST.MF", "Main-Class: org.springframework.boot.loader.launch.JarLauncher\n")
        jar.writestr("BOOT-INF/classes/static/index.html", label)


class DeploymentTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.base = Path(self.temp.name)
        self.app = self.base / "app"
        self.app.mkdir()
        (self.app / ".env").write_text("JWT_SECRET=TEST_ONLY\n")
        (self.app / "uploads").mkdir()
        (self.app / "uploads/preserved.txt").write_text("user upload")
        self.old = self.app / "yasong-art-gallery.jar"
        make_jar(self.old, "old frontend")
        self.old_bytes = self.old.read_bytes()
        self.new = self.base / "new.jar"
        make_jar(self.new, "new frontend")
        self.active = self.base / "active"
        self.active.touch()
        self.bin = self.base / "bin"
        self.bin.mkdir()
        self.sudo = self.bin / "sudo"
        self.sudo.write_text('''#!/usr/bin/env python3
import os, pathlib, sys
args = sys.argv[1:]
assert args[:2] == ['-n', '/usr/bin/systemctl'], args
base = pathlib.Path(os.environ['FAKE_BASE'])
action = args[2]
with (base/'calls').open('a') as stream: stream.write(action+'\\n')
if action == 'is-active': sys.exit(0 if (base/'active').exists() else 3)
if action == 'stop': (base/'active').unlink(missing_ok=True); sys.exit(0)
assert action == 'restart', args
if (base/'fail-next-restart').exists():
    (base/'fail-next-restart').unlink()
    sys.exit(1)
(base/'active').touch()
''')
        self.sudo.chmod(0o755)
        outer = self

        class Handler(http.server.BaseHTTPRequestHandler):
            def do_GET(self):
                if not outer.active.exists() or not outer.old.exists():
                    self.send_error(503)
                    return
                with zipfile.ZipFile(outer.old) as jar:
                    index = jar.read("BOOT-INF/classes/static/index.html")
                if self.path.startswith("/api/notices"):
                    if (outer.base / "fail-new-health").exists() and index == b"new frontend":
                        self.send_error(503)
                        return
                    data = json.dumps({"content": [], "totalElements": 0}).encode()
                    kind = "application/json"
                else:
                    data, kind = index, "text/html"
                self.send_response(200)
                self.send_header("Content-Type", kind)
                self.end_headers()
                self.wfile.write(data)

            def log_message(self, *_):
                pass

        self.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.env = dict(os.environ, PATH=str(self.bin) + os.pathsep + os.environ["PATH"],
                        APP_DIR=str(self.app), FAKE_BASE=str(self.base),
                        HEALTH_URL=f"http://127.0.0.1:{self.server.server_port}", READY_TIMEOUT="1")

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.temp.cleanup()

    def deploy(self, release=SHA):
        return subprocess.run(["bash", str(ROOT / "deployment/deploy.sh"), str(self.new), release],
                              env=self.env, capture_output=True, text=True, timeout=15)

    def test_success_preserves_actual_old_jar_secrets_and_uploads(self):
        result = self.deploy()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertTrue(self.old.is_symlink())
        self.assertEqual(self.old.read_bytes(), self.new.read_bytes())
        backups = list((self.app / "releases").glob("legacy-*/yasong-art-gallery.jar"))
        self.assertEqual(len(backups), 1)
        self.assertEqual(backups[0].read_bytes(), self.old_bytes)
        self.assertEqual((self.app / ".env").read_text(), "JWT_SECRET=TEST_ONLY\n")
        self.assertEqual((self.app / "uploads/preserved.txt").read_text(), "user upload")

    def test_restart_failure_restores_previous_running_release(self):
        (self.base / "fail-next-restart").touch()
        result = self.deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.old.read_bytes(), self.old_bytes)
        self.assertTrue(self.active.exists())

    def test_failed_database_readiness_rolls_back(self):
        (self.base / "fail-new-health").touch()
        result = self.deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.old.read_bytes(), self.old_bytes)
        self.assertTrue(self.active.exists())

    def test_failed_first_deployment_removes_failed_symlink(self):
        self.old.unlink()
        self.active.unlink()
        (self.base / "fail-new-health").touch()
        result = self.deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.old.is_symlink())
        self.assertFalse(self.active.exists())

    def test_previously_stopped_service_stays_stopped_after_failure(self):
        self.active.unlink()
        (self.base / "fail-new-health").touch()
        result = self.deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.old.read_bytes(), self.old_bytes)
        self.assertFalse(self.active.exists())

    def test_concurrent_deployment_is_rejected(self):
        with (self.app / ".deploy.lock").open("w") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            result = self.deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.old.read_bytes(), self.old_bytes)

    def test_same_release_with_different_content_is_rejected(self):
        self.assertEqual(self.deploy().returncode, 0)
        make_jar(self.new, "different content")
        result = self.deploy()
        self.assertNotEqual(result.returncode, 0)
        with zipfile.ZipFile(self.old) as jar:
            self.assertEqual(jar.read("BOOT-INF/classes/static/index.html"), b"new frontend")

    def test_same_commit_can_be_redeployed_with_unique_run_id(self):
        self.assertEqual(self.deploy(SHA + "-1-1").returncode, 0)
        make_jar(self.new, "another build")
        result = self.deploy(SHA + "-2-1")
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_missing_environment_file_is_rejected(self):
        (self.app / ".env").unlink()
        self.assertNotEqual(self.deploy().returncode, 0)
        self.assertEqual(self.old.read_bytes(), self.old_bytes)

    def test_invalid_release_id_is_rejected(self):
        self.assertNotEqual(self.deploy("../../escape").returncode, 0)
        self.assertEqual(self.old.read_bytes(), self.old_bytes)


if __name__ == "__main__":
    unittest.main()
