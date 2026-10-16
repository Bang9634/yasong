"""Run the workflow's actual shell blocks with disposable files and fake SSH."""
import base64
import hashlib
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent.parent


def workflow_script(name):
    lines = (ROOT / '.github/workflows/ci-cd.yml').read_text().splitlines()
    start = lines.index('      - name: ' + name)
    run = next(i for i in range(start + 1, len(lines)) if lines[i] == '        run: |')
    result = []
    for line in lines[run + 1:]:
        if line.strip() and not line.startswith('          '):
            break
        result.append(line[10:])
    return '\n'.join(result) + '\n'


class WorkflowShellTest(unittest.TestCase):
    def test_jwt_key_is_one_valid_environment_line(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / 'environment'
            process = subprocess.run(['bash', '-e', '-c', workflow_script('Create an ephemeral test-only JWT key')],
                                     env=dict(os.environ, GITHUB_ENV=str(path)), capture_output=True)
            self.assertEqual(process.returncode, 0)
            lines = path.read_text().splitlines()
            self.assertEqual(len(lines), 1, 'JWT key must fit on one GITHUB_ENV line')
            self.assertTrue(lines[0].startswith('JWT_SECRET='))
            self.assertEqual(len(base64.b64decode(lines[0].split('=', 1)[1], validate=True)), 64)

    def test_release_commit_and_checksums_use_real_newlines(self):
        with tempfile.TemporaryDirectory() as temp:
            cwd = Path(temp)
            for name in ['backend/target/yasong-art-gallery.jar', 'deployment/deploy.sh', 'deployment/check-ready.py']:
                path = cwd / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text('test artifact')
            sha = 'a' * 40
            subprocess.run(['bash', '-e', '-c', workflow_script('Prepare checksummed release')], cwd=cwd,
                           env=dict(os.environ, GITHUB_SHA=sha), check=True)
            self.assertEqual((cwd / 'release/COMMIT').read_text(), sha + '\n')
            for line in (cwd / 'release/SHA256SUMS').read_text().splitlines():
                digest, filename = line.split('  ', 1)
                self.assertEqual(digest, hashlib.sha256((cwd / 'release' / filename).read_bytes()).hexdigest())

    def test_ssh_files_preserve_multiline_keys_and_known_hosts(self):
        with tempfile.TemporaryDirectory() as temp:
            cwd = Path(temp)
            tools = cwd / 'bin'
            tools.mkdir()
            (cwd / 'release').mkdir()
            (cwd / 'release/artifact').write_text('test artifact')
            script = '''#!/usr/bin/env python3
import os, pathlib, sys
args=sys.argv[1:]
key=pathlib.Path(args[args.index('-i')+1]).read_text()
known=next(arg.split('=',1)[1] for arg in args if arg.startswith('UserKnownHostsFile='))
assert key == os.environ['SSH_PRIVATE_KEY']+'\\n'
assert pathlib.Path(known).read_text() == os.environ['SSH_KNOWN_HOSTS']+'\\n'
assert 'StrictHostKeyChecking=yes' in args
'''
            for name in ['ssh', 'scp']:
                path = tools / name
                path.write_text(script)
                path.chmod(0o755)
            env = dict(os.environ, PATH=str(tools) + os.pathsep + os.environ['PATH'],
                       SSH_PRIVATE_KEY='TEST KEY\nline two\nEND TEST KEY', SSH_KNOWN_HOSTS='example.invalid ssh-ed25519 TEST_ONLY',
                       DEPLOY_HOST='example.invalid', DEPLOY_USER='yasong-art-gallery', DEPLOY_PORT='22',
                       GITHUB_SHA='a' * 40, GITHUB_RUN_ID='1', GITHUB_RUN_ATTEMPT='1')
            subprocess.run(['bash', '-e', '-c', workflow_script('Deploy over SSH')], cwd=cwd, env=env, check=True)


if __name__ == '__main__':
    unittest.main()
