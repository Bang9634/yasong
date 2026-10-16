#!/usr/bin/env bash
# ROOT is supplied by the caller. Never print or source private configuration.
configure_local_environment() {
    export SPRING_PROFILES_ACTIVE="${SPRING_PROFILES_ACTIVE:-local}"
    export FILE_UPLOAD_DIR="${FILE_UPLOAD_DIR:-$ROOT/uploads}"
    local config="$ROOT/backend/src/main/resources/application-local.properties"
    if [[ "$SPRING_PROFILES_ACTIVE" == local && -z "${SPRING_CONFIG_ADDITIONAL_LOCATION:-}" && -f "$config" ]]; then
        export SPRING_CONFIG_ADDITIONAL_LOCATION="file:$config"
    fi
}
