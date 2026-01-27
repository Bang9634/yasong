#!/bin/bash

# Yasongmuseum 초기 설정 스크립트 (서버에서 최초 1회 실행)

APP_NAME="yasongmuseum"
APP_USER="yasongmuseum"
APP_DIR="/home/$APP_USER"
SERVICE_FILE="yasongmuseum.service"

echo "=========================================="
echo "  Yasongmuseum 초기 설정"
echo "=========================================="

# 1. 사용자 생성 (이미 있으면 스킵)
if id "$APP_USER" &>/dev/null; then
    echo "✓ 사용자 $APP_USER 이미 존재합니다."
else
    echo "사용자 $APP_USER 생성 중..."
    sudo useradd -m -s /bin/bash $APP_USER
    echo "✓ 사용자 생성 완료"
fi

# 2. 디렉토리 생성
echo "디렉토리 구조 생성 중..."
sudo mkdir -p $APP_DIR/deployment
sudo mkdir -p $APP_DIR/backups
sudo mkdir -p $APP_DIR/uploads
sudo mkdir -p /var/log/yasongmuseum

# 3. 권한 설정
echo "권한 설정 중..."
sudo chown -R $APP_USER:$APP_USER $APP_DIR
sudo chown -R $APP_USER:$APP_USER /var/log/yasongmuseum
sudo chmod 755 $APP_DIR

# 4. Systemd 서비스 파일 복사
if [ -f "$APP_DIR/deployment/$SERVICE_FILE" ]; then
    echo "Systemd 서비스 파일 설치 중..."
    sudo cp $APP_DIR/deployment/$SERVICE_FILE /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable $APP_NAME
    echo "✓ 서비스 파일 설치 완료"
else
    echo "⚠ 경고: 서비스 파일을 찾을 수 없습니다."
    echo "  파일을 업로드한 후 다음 명령을 실행하세요:"
    echo "  sudo cp $APP_DIR/deployment/$SERVICE_FILE /etc/systemd/system/"
    echo "  sudo systemctl daemon-reload"
    echo "  sudo systemctl enable $APP_NAME"
fi

# 5. 방화벽 설정 (선택사항)
echo ""
read -p "방화벽에서 포트 8080을 열겠습니까? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v ufw &> /dev/null; then
        sudo ufw allow 8080/tcp
        echo "✓ UFW 방화벽 규칙 추가됨"
    elif command -v firewall-cmd &> /dev/null; then
        sudo firewall-cmd --permanent --add-port=8080/tcp
        sudo firewall-cmd --reload
        echo "✓ firewalld 방화벽 규칙 추가됨"
    else
        echo "⚠ 방화벽 관리 도구를 찾을 수 없습니다."
    fi
fi

echo ""
echo "=========================================="
echo "  초기 설정 완료!"
echo "=========================================="
echo ""
echo "다음 단계:"
echo "1. JAR 파일 업로드:"
echo "   scp target/yasongmuseum-0.0.1-SNAPSHOT.jar $APP_USER@서버주소:$APP_DIR/"
echo ""
echo "2. 배포 스크립트 업로드:"
echo "   scp -r deployment/* $APP_USER@서버주소:$APP_DIR/deployment/"
echo ""
echo "3. 스크립트 실행 권한 부여:"
echo "   chmod +x $APP_DIR/deployment/*.sh"
echo ""
echo "4. 배포 실행:"
echo "   $APP_DIR/deployment/deploy.sh"
echo ""
