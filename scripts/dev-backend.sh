#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=scripts/lib/local-env.sh
source "$ROOT/scripts/lib/local-env.sh"
configure_local_environment
cd "$ROOT/backend"
exec ./mvnw spring-boot:run "$@"
