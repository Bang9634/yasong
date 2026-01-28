#!/bin/bash

# Yasongmuseum 중지 스크립트 (Systemd)

APP_NAME="yasong-art-gallery"

echo "[$APP_NAME] 중지합니다..."

sudo systemctl stop $APP_NAME

if sudo systemctl is-active --quiet $APP_NAME; then
    echo "❌ 중지 실패. 로그를 확인하세요:"
    echo "  sudo journalctl -u $APP_NAME -n 20"
    exit 1
else
    echo "✅ [$APP_NAME] 정상 중지되었습니다."
fi
