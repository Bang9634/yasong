#!/bin/bash

# ngrok을 사용한 로컬 개발 서버 외부 공개

echo "=========================================="
echo "  Yasongmuseum 로컬 서버 외부 공개"
echo "=========================================="

# ngrok 설치 확인
if ! command -v ngrok &> /dev/null; then
    echo "ngrok이 설치되어 있지 않습니다."
    echo ""
    echo "설치 방법:"
    echo "  brew install ngrok"
    echo ""
    echo "또는 https://ngrok.com/download 에서 다운로드"
    exit 1
fi

echo "애플리케이션을 먼저 실행하세요:"
echo "  java -jar yasong-art-gallery.jar"
echo ""
read -p "애플리케이션이 실행 중입니까? (y/n): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "애플리케이션을 먼저 실행해주세요."
    exit 1
fi

echo ""
echo "ngrok 터널을 생성합니다..."
echo "Ctrl+C로 종료할 수 있습니다."
echo ""

ngrok http 8080
