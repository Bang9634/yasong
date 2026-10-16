#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=scripts/lib/local-env.sh
source "$ROOT/scripts/lib/local-env.sh"
configure_local_environment
JAR="$ROOT/backend/target/yasong-art-gallery.jar"
[[ -f "$JAR" ]] || { echo 'Run ./scripts/build.sh first' >&2; exit 1; }
cd "$ROOT"
exec java -jar "$JAR" "$@"
