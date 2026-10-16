#!/usr/bin/env bash
set -euo pipefail
# Use the installed unit and its server-side environment/configuration.
# Never launch a stale pre-monorepo JAR from the root target directory.
if [[ ! -x /usr/bin/systemctl ]]; then
    echo 'Production startup requires Ubuntu/systemd. For local use: ./scripts/run-local.sh' >&2
    exit 1
fi
exec sudo /usr/bin/systemctl start yasong-art-gallery.service
