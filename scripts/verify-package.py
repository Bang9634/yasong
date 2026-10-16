#!/usr/bin/env python3
"""Fail the build if the JAR lacks the frontend or includes local credentials."""
import pathlib
import re
import sys
import zipfile

jar_path = pathlib.Path(sys.argv[1])
root = pathlib.Path(__file__).resolve().parent.parent
with zipfile.ZipFile(jar_path) as jar:
    names = set(jar.namelist())
    forbidden = [name for name in names if name.startswith("BOOT-INF/classes/") and (
        re.search(r"(?:^|/)(?:application-(?:local|dev)\.properties|\.env(?:\..*)?|.*\.(?:pem|key|hprof)|(?:service-account|google-analytics-key).*\.json)$", name)
    )]
    if forbidden:
        raise SystemExit("Local configuration included in JAR: " + ", ".join(forbidden))
    for file in (root / "frontend/dist").rglob("*"):
        if file.is_file():
            name = "BOOT-INF/classes/static/" + file.relative_to(root / "frontend/dist").as_posix()
            if name not in names or jar.read(name) != file.read_bytes():
                raise SystemExit("Frontend output missing or stale: " + name)
    index = "BOOT-INF/classes/static/index.html"
    if index not in names:
        raise SystemExit("Frontend index.html is missing")
    for asset in re.findall(r'(?:src|href)="(/assets/[^"?#]+)', jar.read(index).decode()):
        if "BOOT-INF/classes/static" + asset not in names:
            raise SystemExit("Referenced frontend asset is missing: " + asset)
print("Verified frontend assets and excluded local configuration in " + jar_path.name)
