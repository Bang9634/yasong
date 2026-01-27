#!/bin/bash
# 서버에 환경 변수 설정 스크립트
# 사용법: sudo bash setup-env.sh

set -e

echo "======================================"
echo "YaSongMuseum 환경 변수 설정"
echo "======================================"

# .env 파일 경로
ENV_FILE="/home/yasongmuseum/.env"

# JWT Secret 생성 함수
generate_jwt_secret() {
    openssl rand -base64 64 | tr -d '\n'
}

# 사용자 입력 받기
read -p "DB URL (기본: jdbc:mysql://localhost:3306/yasongmuseum?useSSL=true&serverTimezone=Asia/Seoul): " DB_URL
DB_URL=${DB_URL:-jdbc:mysql://localhost:3306/yasongmuseum?useSSL=true&serverTimezone=Asia/Seoul}

read -p "DB Username (기본: yasongmuseum_user): " DB_USERNAME
DB_USERNAME=${DB_USERNAME:-yasongmuseum_user}

read -sp "DB Password: " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ DB 비밀번호는 필수입니다!"
    exit 1
fi

read -p "서버 포트 (기본: 8080): " SERVER_PORT
SERVER_PORT=${SERVER_PORT:-8080}

# JWT Secret 자동 생성
echo ""
echo "🔐 JWT Secret 생성 중..."
JWT_SECRET=$(generate_jwt_secret)
echo "✅ JWT Secret 생성 완료"

# .env 파일 생성
echo ""
echo "📝 .env 파일 생성 중..."

cat > "$ENV_FILE" << EOF
# YaSongMuseum 환경 변수
# 생성일시: $(date)
# 주의: 이 파일은 절대 Git에 커밋하지 마세요!

# JWT 설정
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=86400000

# 데이터베이스 설정
DB_URL=$DB_URL
DB_USERNAME=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD

# 서버 설정
SERVER_PORT=$SERVER_PORT
SPRING_PROFILES_ACTIVE=prod
EOF

# 파일 권한 설정 (소유자만 읽기 가능)
chmod 600 "$ENV_FILE"
chown yasongmuseum:yasongmuseum "$ENV_FILE"

echo "✅ .env 파일이 생성되었습니다: $ENV_FILE"
echo ""
echo "⚠️  보안 주의사항:"
echo "   1. .env 파일 권한: $(ls -la $ENV_FILE | awk '{print $1, $3, $4}')"
echo "   2. JWT Secret 길이: $(echo -n $JWT_SECRET | wc -c) 바이트"
echo "   3. 절대 Git에 커밋하지 마세요!"
echo ""
echo "✅ 설정 완료! 이제 서비스를 시작할 수 있습니다:"
echo "   sudo systemctl start yasongmuseum"
echo "======================================"
