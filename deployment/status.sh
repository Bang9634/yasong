#!/bin/bash

# Yasongmuseum 상태 확인 스크립트 (Systemd)

APP_NAME="yasong-art-gallery"

echo "=========================================="
echo "  $APP_NAME 상태"
echo "=========================================="
echo ""

# 서비스 상태
sudo systemctl status $APP_NAME --no-pager

echo ""
echo "=========================================="
echo "  최근 로그 (마지막 20줄)"
echo "=========================================="
sudo journalctl -u $APP_NAME -n 20 --no-pager

echo ""
echo "=========================================="
echo "  유용한 명령어"
echo "=========================================="
echo "실시간 로그:    sudo journalctl -u $APP_NAME -f"
echo "전체 로그:      sudo journalctl -u $APP_NAME"
echo "오늘 로그:      sudo journalctl -u $APP_NAME --since today"
echo "재시작:         sudo systemctl restart $APP_NAME"
