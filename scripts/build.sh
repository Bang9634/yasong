#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)

if [[ -n "${NAVER_MAP_CLIENT_ID:-}" ]]; then
    export VITE_NAVER_MAP_CLIENT_ID="$NAVER_MAP_CLIENT_ID"
fi
# The packaged frontend calls /api on the same origin as Spring Boot.
export VITE_API_BASE_URL=""
(
    cd "$ROOT/frontend"
    npm ci --no-audit --no-fund
    npm run build
)
(
    cd "$ROOT/backend"
    ./mvnw --batch-mode --no-transfer-progress clean verify
)
python3 "$ROOT/scripts/verify-package.py" "$ROOT/backend/target/yasong-art-gallery.jar"
