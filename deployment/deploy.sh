#!/usr/bin/env bash
# Ubuntu only. Run as the service account; systemctl needs narrowly scoped sudo.
set -euo pipefail
umask 027

APP_DIR=${APP_DIR:-/home/yasong-art-gallery}
SERVICE_NAME=${SERVICE_NAME:-yasong-art-gallery.service}
HEALTH_URL=${HEALTH_URL:-http://127.0.0.1:8080}
READY_TIMEOUT=${READY_TIMEOUT:-120}
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
SOURCE_JAR=${1:?Usage: deploy.sh /path/to/new.jar release-commit-sha}
RELEASE_ID=${2:?A release commit SHA is required}

[[ "$RELEASE_ID" =~ ^[0-9a-f]{40,64}(-[0-9]+-[0-9]+)?$ ]] || { echo 'Invalid release SHA' >&2; exit 1; }
[[ "$SERVICE_NAME" =~ ^[a-zA-Z0-9_.@-]+\.service$ ]] || { echo 'Invalid service name' >&2; exit 1; }
[[ "$READY_TIMEOUT" =~ ^[1-9][0-9]*$ ]] || { echo 'Invalid readiness timeout' >&2; exit 1; }
[[ -f "$SOURCE_JAR" && -s "$SOURCE_JAR" ]] || { echo 'JAR missing or empty' >&2; exit 1; }
[[ -f "$APP_DIR/.env" ]] || { echo 'Required server .env is missing' >&2; exit 1; }
# Do not source .env here: systemd owns its parsing and injects existing secrets.
mkdir -p "$APP_DIR/releases"
exec 9>"$APP_DIR/.deploy.lock"
flock -n 9 || { echo 'Another deployment is running' >&2; exit 1; }

APP_JAR="$APP_DIR/yasong-art-gallery.jar"
RELEASE_DIR="$APP_DIR/releases/$RELEASE_ID"
PREVIOUS=''
WAS_ACTIVE=0
SWITCHED=0
sudo -n /usr/bin/systemctl is-active --quiet "$SERVICE_NAME" && WAS_ACTIVE=1

if [[ -L "$APP_JAR" ]]; then
    PREVIOUS=$(readlink -f -- "$APP_JAR")
    [[ -s "$PREVIOUS" ]] || { echo 'Previous release symlink is broken' >&2; exit 1; }
elif [[ -f "$APP_JAR" ]]; then
    # Back up the actual old JAR BEFORE installing the uploaded new release.
    LEGACY_DIR=$(mktemp -d "$APP_DIR/releases/legacy-XXXXXXXX")
    install -m 640 -- "$APP_JAR" "$LEGACY_DIR/yasong-art-gallery.jar"
    PREVIOUS="$LEGACY_DIR/yasong-art-gallery.jar"
fi

if [[ -e "$RELEASE_DIR" ]]; then
    cmp -s -- "$SOURCE_JAR" "$RELEASE_DIR/yasong-art-gallery.jar" || {
        echo 'Release SHA already exists with different content' >&2; exit 1;
    }
else
    TEMP_RELEASE=$(mktemp -d "$APP_DIR/releases/.staging-XXXXXXXX")
    install -m 640 -- "$SOURCE_JAR" "$TEMP_RELEASE/yasong-art-gallery.jar"
    python3 - "$TEMP_RELEASE/yasong-art-gallery.jar" <<'PY'
import sys, zipfile
with zipfile.ZipFile(sys.argv[1]) as jar:
    for name in ['META-INF/MANIFEST.MF', 'BOOT-INF/classes/static/index.html']:
        jar.getinfo(name)
    if 'org.springframework.boot.loader.launch.JarLauncher' not in jar.read('META-INF/MANIFEST.MF').decode():
        raise SystemExit('JAR is not a Spring Boot executable')
PY
    mv -- "$TEMP_RELEASE" "$RELEASE_DIR"
fi

switch_to() {
    local target=$1
    ln -s -- "$target" "$APP_DIR/.jar-link-$$"
    mv -Tf -- "$APP_DIR/.jar-link-$$" "$APP_JAR"
}

rollback() {
    local failure=$?
    trap - EXIT INT TERM HUP
    rm -f -- "$APP_DIR/.jar-link-$$"
    if (( SWITCHED )); then
        echo 'Deployment failed; restoring the previous JAR' >&2
        if [[ -n "$PREVIOUS" ]]; then
            switch_to "$PREVIOUS"
            if (( WAS_ACTIVE )); then
                sudo -n /usr/bin/systemctl restart "$SERVICE_NAME" || true
                python3 "$SCRIPT_DIR/check-ready.py" "$HEALTH_URL" "$PREVIOUS" "$READY_TIMEOUT" || {
                    echo 'Previous JAR restored, but recovery health check failed; inspect service journal' >&2;
                }
            else
                sudo -n /usr/bin/systemctl stop "$SERVICE_NAME" || true
            fi
        else
            sudo -n /usr/bin/systemctl stop "$SERVICE_NAME" || true
            rm -f -- "$APP_JAR"
        fi
    fi
    exit "$failure"
}
trap rollback EXIT
trap 'exit 130' INT
trap 'exit 143' TERM HUP

# Set first so a failure/signal immediately after the atomic rename rolls back.
SWITCHED=1
switch_to "$RELEASE_DIR/yasong-art-gallery.jar"
sudo -n /usr/bin/systemctl restart "$SERVICE_NAME"
python3 "$SCRIPT_DIR/check-ready.py" "$HEALTH_URL" "$APP_JAR" "$READY_TIMEOUT"
SWITCHED=0
trap - EXIT INT TERM HUP
echo "Deployed release $RELEASE_ID"
# Deliberately retain releases. Database migrations are NOT reversed by JAR rollback.
