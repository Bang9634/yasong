#!/usr/bin/env python3
"""Check the deployed index and a database-backed API, without exposing credentials."""
import hashlib
import json
import sys
import time
import urllib.request
import zipfile

base_url, jar_path = sys.argv[1:3]
timeout = int(sys.argv[3]) if len(sys.argv) > 3 else 120
with zipfile.ZipFile(jar_path) as jar:
    expected = hashlib.sha256(jar.read("BOOT-INF/classes/static/index.html")).digest()
deadline = time.monotonic() + timeout
while time.monotonic() < deadline:
    try:
        with urllib.request.urlopen(base_url.rstrip("/") + "/index.html", timeout=3) as response:
            if hashlib.sha256(response.read()).digest() != expected:
                raise RuntimeError("Unexpected frontend version")
        with urllib.request.urlopen(base_url.rstrip("/") + "/api/notices?page=1&limit=1", timeout=3) as response:
            if response.headers.get_content_type() != "application/json":
                raise RuntimeError("API did not return JSON")
            body = json.load(response)
            if not isinstance(body.get("content"), list) or "totalElements" not in body:
                raise RuntimeError("Unexpected API response")
        print("Ready: expected frontend and database-backed API respond")
        sys.exit(0)
    except Exception:
        time.sleep(2)
raise SystemExit("Readiness check failed: inspect the service journal on the server")
