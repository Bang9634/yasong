#!/bin/bash

# Yasongmuseum Systemd 배포 스크립트

APP_NAME="yasong-art-gallery"
JAR_FILE="yasong-art-gallery.jar"
APP_DIR="/home/yasong-art-gallery"
SERVICE_FILE="yasong-art-gallery.service"
BACKUP_DIR="$APP_DIR/backups"

echo "=========================================="
echo "  Yasongmuseum 배포 스크립트 (Systemd)"
echo "=========================================="

# 백업 디렉토리 생성
mkdir -p $BACKUP_DIR

# 기존 JAR 파일 백업
if [ -f "$APP_DIR/$JAR_FILE" ]; then
    echo "기존 JAR 파일 백업 중..."
    BACKUP_FILE="$BACKUP_DIR/$JAR_FILE.$(date +%Y%m%d_%H%M%S)"
    cp "$APP_DIR/$JAR_FILE" "$BACKUP_FILE"
    echo "백업 완료: $BACKUP_FILE"
fi

# 새 JAR 파일이 있는지 확인
if [ ! -f "$APP_DIR/$JAR_FILE" ]; then
    echo "오류: $APP_DIR/$JAR_FILE 파일이 없습니다."
    echo "먼저 JAR 파일을 업로드하세요:"
    echo "  scp target/$JAR_FILE user@server:$APP_DIR/"
    exit 1
fi

# systemd 서비스 파일 설치 (처음 한 번만 필요)
if [ ! -f "/etc/systemd/system/$SERVICE_FILE" ]; then
    echo "systemd 서비스 파일 설치 중..."
    echo "다음 명령을 root로 실행하세요:"
    echo "  sudo cp $APP_DIR/deployment/$SERVICE_FILE /etc/systemd/system/"
    echo "  sudo systemctl daemon-reload"
    echo "  sudo systemctl enable $APP_NAME"
    echo ""
    read -p "서비스 파일을 설치했습니까? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "배포를 취소합니다."
        exit 1
    fi
fi

# 서비스 재시작
echo "애플리케이션 재시작 중..."
sudo systemctl restart $APP_NAME

# 상태 확인
sleep 3
if sudo systemctl is-active --quiet $APP_NAME; then
    echo ""
    echo "✅ 배포 성공!"
    echo ""
    echo "상태 확인: sudo systemctl status $APP_NAME"
    echo "로그 확인: sudo journalctl -u $APP_NAME -f"
    echo "중지:     sudo systemctl stop $APP_NAME"
    echo "시작:     sudo systemctl start $APP_NAME"
else
    echo ""
    echo "❌ 배포 실패! 로그를 확인하세요:"
    echo "  sudo journalctl -u $APP_NAME -n 50"
    exit 1
fi
