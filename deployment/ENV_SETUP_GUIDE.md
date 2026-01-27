# 환경 변수 설정 가이드

## 🔐 보안 주의사항

**절대 하지 말아야 할 것**:
- ❌ `.env` 파일을 Git에 커밋
- ❌ JWT Secret을 코드에 하드코딩
- ❌ DB 비밀번호를 properties 파일에 저장
- ❌ 프로덕션 환경 변수를 개발자와 공유

## 🚀 빠른 시작

### 1. 로컬 개발 환경

```bash
# 프로젝트 루트에서
cp .env.example .env

# .env 파일 편집
nano .env

# JWT Secret 자동 생성
JWT_SECRET=$(openssl rand -base64 64)
echo "JWT_SECRET=$JWT_SECRET" >> .env

# 애플리케이션 실행 (환경 변수 자동 로드)
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### 2. 프로덕션 서버

```bash
# 서버에 배포 후
cd /home/yasongmuseum
sudo bash deployment/setup-env.sh

# 대화형으로 환경 변수 입력
# - DB URL, Username, Password
# - 서버 포트
# - JWT Secret은 자동 생성됨

# 서비스 시작
sudo systemctl start yasongmuseum
```

## 📝 환경 변수 설명

### JWT_SECRET
- **용도**: JWT 토큰 서명/검증
- **형식**: Base64 인코딩된 64바이트 이상 문자열
- **생성**: `openssl rand -base64 64`
- **예시**: `zETF3zUq...` (86자 이상)

### JWT_EXPIRATION
- **용도**: JWT 토큰 만료 시간
- **형식**: 밀리초 단위
- **기본값**: `86400000` (24시간)
- **예시**: `3600000` (1시간)

### DB_URL
- **용도**: MySQL 데이터베이스 연결 URL
- **형식**: `jdbc:mysql://호스트:포트/데이터베이스명?옵션`
- **예시**: `jdbc:mysql://localhost:3306/yasongmuseum?useSSL=true&serverTimezone=Asia/Seoul`

### DB_USERNAME
- **용도**: 데이터베이스 사용자명
- **기본값**: `yasongmuseum_user`
- **권장**: 최소 권한 원칙 (SELECT, INSERT, UPDATE, DELETE만)

### DB_PASSWORD
- **용도**: 데이터베이스 비밀번호
- **보안 요구사항**:
  - 12자 이상
  - 대소문자, 숫자, 특수문자 포함
  - 사전에 없는 단어

### SERVER_PORT
- **용도**: 애플리케이션 실행 포트
- **기본값**: `8080`
- **프로덕션**: `80` (HTTP) 또는 `443` (HTTPS)

### SPRING_PROFILES_ACTIVE
- **용도**: Spring Boot 프로파일 선택
- **값**: `local`, `dev`, `prod`
- **기본값**: `prod`

## 🔧 고급 설정

### Docker 환경

```dockerfile
# Dockerfile에서
ENV JWT_SECRET=${JWT_SECRET}
ENV DB_PASSWORD=${DB_PASSWORD}

# docker-compose.yml에서
environment:
  - JWT_SECRET=${JWT_SECRET}
  - DB_PASSWORD=${DB_PASSWORD}
```

### Kubernetes 환경

```bash
# Secret 생성
kubectl create secret generic yasongmuseum-secrets \
  --from-literal=jwt-secret=$(openssl rand -base64 64) \
  --from-literal=db-password="강력한비밀번호"

# deployment.yaml에서 참조
env:
  - name: JWT_SECRET
    valueFrom:
      secretKeyRef:
        name: yasongmuseum-secrets
        key: jwt-secret
```

### AWS Secrets Manager

```bash
# Secret 생성
aws secretsmanager create-secret \
  --name yasongmuseum/prod/jwt-secret \
  --secret-string "$(openssl rand -base64 64)"

# 애플리케이션에서 조회 (AWS SDK 사용)
```

## 🔐 보안 모범 사례

### 1. JWT Secret 관리
- ✅ **DO**: 64바이트 이상 랜덤 생성
- ✅ **DO**: 정기적으로 교체 (6개월마다)
- ❌ **DON'T**: 단순한 문자열 사용
- ❌ **DON'T**: 여러 환경에서 동일한 Secret 재사용

### 2. DB Password 관리
- ✅ **DO**: 각 환경마다 다른 비밀번호 사용
- ✅ **DO**: 비밀번호 관리자 사용
- ❌ **DON'T**: 개발 환경과 프로덕션 환경 비밀번호 공유
- ❌ **DON'T**: 슬랙, 이메일로 비밀번호 전송

### 3. 환경 변수 백업
```bash
# 안전하게 백업 (암호화)
tar -czf env-backup.tar.gz .env
gpg --symmetric --cipher-algo AES256 env-backup.tar.gz
rm env-backup.tar.gz

# 복원
gpg --decrypt env-backup.tar.gz.gpg > env-backup.tar.gz
tar -xzf env-backup.tar.gz
```

## 🚨 트러블슈팅

### 환경 변수가 로드되지 않음

```bash
# 1. .env 파일 존재 확인
ls -la /home/yasongmuseum/.env

# 2. 파일 권한 확인 (600이어야 함)
chmod 600 /home/yasongmuseum/.env

# 3. 소유자 확인
chown yasongmuseum:yasongmuseum /home/yasongmuseum/.env

# 4. 서비스 재시작
sudo systemctl restart yasongmuseum

# 5. 로그 확인
sudo journalctl -u yasongmuseum -n 50
```

### JWT Secret 오류

```bash
# Base64 디코딩 확인
echo "$JWT_SECRET" | base64 -d | wc -c
# 결과: 64 이상이어야 함

# 새로운 Secret 생성
NEW_SECRET=$(openssl rand -base64 64)
echo "JWT_SECRET=$NEW_SECRET" > /home/yasongmuseum/.env
```

### DB 연결 실패

```bash
# MySQL 연결 테스트
mysql -h localhost -u yasongmuseum_user -p -D yasongmuseum

# 방화벽 확인
sudo ufw status
sudo ufw allow 3306/tcp

# MySQL 사용자 권한 확인
GRANT ALL PRIVILEGES ON yasongmuseum.* TO 'yasongmuseum_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📚 참고 자료

- [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [OWASP Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)
- [12 Factor App - Config](https://12factor.net/config)
