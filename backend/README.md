> 모노레포 전환 이전 문서입니다. 현재 빌드·배포 방법은 [루트 README](../README.md)를 따르세요.

# 🏛️ Yasong Art Gallery - 야송미술관 웹사이트

Spring Boot 기반 미술관 웹사이트 백엔드 API 서버

## 📋 목차

- [기술 스택](#기술-스택)
- [시스템 요구사항](#시스템-요구사항)
- [로컬 개발 환경 설정](#로컬-개발-환경-설정)
- [프로덕션 배포](#프로덕션-배포)
- [API 문서](#api-문서)
- [프로젝트 구조](#프로젝트-구조)

## 🛠️ 기술 스택

- **Java 21**
- **Spring Boot 4.0.1**
- **MySQL 8.0+**
- **Spring Security + JWT**
- **Flyway** (DB 마이그레이션)
- **Maven**

## 💻 시스템 요구사항

### 로컬 개발
- Java 21+
- Maven 3.8+
- MySQL 8.0+

### 프로덕션 서버
- **최소:** 1GB RAM, 1 CPU Core
- **권장:** 2GB RAM, 2 CPU Cores
- Linux (Ubuntu 20.04+, CentOS 7+)
- Java 21
- MySQL 8.0+

## 🚀 로컬 개발 환경 설정

### 1. 프로젝트 클론

```bash
git clone https://github.com/bang9634/yasong-art-gallery.git
cd yasong-art-gallery
```

### 2. 데이터베이스 설정

```sql
-- MySQL 접속
mysql -u root -p

-- 데이터베이스 생성
CREATE DATABASE yasongmuseum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 (선택사항)
CREATE USER 'yasongmuseum'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON yasongmuseum.* TO 'yasongmuseum'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집
vi .env
```

`.env` 파일 내용:
```bash
# Database
DB_URL=jdbc:mysql://localhost:3306/yasongmuseum?useSSL=false&serverTimezone=Asia/Seoul
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT Secret (보안키 생성: openssl rand -base64 64)
JWT_SECRET=your_generated_secret_key
JWT_EXPIRATION=86400000

# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=local
```

### 4. 애플리케이션 실행

```bash
# Maven으로 실행 (개발 모드)
./mvnw spring-boot:run

# 또는 IDE에서 YasongmuseumApplication.java 실행
```

서버가 시작되면 `http://localhost:8080` 에서 접속 가능합니다.

### 5. 초기 관리자 계정

애플리케이션이 처음 시작되면 자동으로 생성됩니다:
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **프로덕션에서는 반드시 비밀번호를 변경하세요!**

## 🌐 프로덕션 배포

### 방법 1: Systemd 서비스 (권장)

상세 가이드: [deployment/README.md](deployment/README.md)

#### 빠른 시작

```bash
# 1. 로컬에서 빌드
./mvnw clean package -DskipTests

# 2. 서버에 파일 업로드
scp target/yasong-art-gallery.jar user@server:/home/yasong-art-gallery/
scp -r deployment user@server:/home/yasong-art-gallery/

# 3. 서버에서 초기 설정 (최초 1회)
ssh user@server
cd /home/yasong-art-gallery
chmod +x deployment/*.sh
sudo ./deployment/setup.sh

# 4. .env 파일 생성
./deployment/setup-env.sh

# 5. 배포
sudo ./deployment/deploy.sh
```

#### 관리 명령어

```bash
# 서비스 시작
sudo systemctl start yasong-art-gallery

# 서비스 중지
sudo systemctl stop yasong-art-gallery

# 서비스 재시작
sudo systemctl restart yasong-art-gallery

# 서비스 상태 확인
./deployment/status.sh

# 실시간 로그
sudo journalctl -u yasong-art-gallery -f
```

### 방법 2: 직접 실행

```bash
# 프로덕션 모드로 실행
./deployment/start-prod.sh

# 백그라운드 실행
nohup java -jar yasong-art-gallery.jar --spring.profiles.active=prod > logs/app.log 2>&1 &
```

### HTTPS 설정

Nginx + Let's Encrypt 설정: [deployment/HTTPS_SETUP_GUIDE.md](deployment/HTTPS_SETUP_GUIDE.md)

```bash
sudo ./deployment/setup-ssl.sh
```

## 📖 API 문서

### 인증 (Authentication)

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| POST | `/api/auth/login` | 로그인 | Public |
| POST | `/api/auth/signup` | 회원가입 | Admin |
| GET | `/api/auth/me` | 내 정보 조회 | Authenticated |

### 공지사항 (Notices)

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/notices` | 공지사항 목록 | Public |
| GET | `/api/notices/{id}` | 공지사항 상세 | Public |
| POST | `/api/management/notices` | 공지사항 작성 | Admin/Manager |
| PUT | `/api/management/notices/{id}` | 공지사항 수정 | Admin/Manager |
| DELETE | `/api/management/notices/{id}` | 공지사항 삭제 | Admin/Manager |
| POST | `/api/management/notices/upload-image` | 에디터 이미지 업로드 | Admin/Manager |
| POST | `/api/management/notices/{id}/attachments` | 첨부파일 업로드 | Admin/Manager |
| GET | `/api/files/attachments/{id}` | 첨부파일 다운로드 | Public |

### 웹사이트 설정 (Website Settings)

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/website/settings` | 전체 설정 조회 | Public |
| PUT | `/api/management/website/settings` | 설정 수정 | Admin/Manager |
| POST | `/api/management/website/images/{imageType}` | 이미지 업로드 | Admin/Manager |

### 컬렉션 (Collections)

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/collections` | 소장품 목록 | Public |
| GET | `/api/collections/{id}` | 소장품 상세 | Public |
| POST | `/api/management/collections` | 소장품 등록 | Admin/Manager |
| PUT | `/api/management/collections/{id}` | 소장품 수정 | Admin/Manager |
| DELETE | `/api/management/collections/{id}` | 소장품 삭제 | Admin/Manager |

## 📁 프로젝트 구조

```
yasong-art-gallery/
├── src/
│   ├── main/
│   │   ├── java/com/bang9634/yasongmuseum/
│   │   │   ├── common/          # 공통 기능 (Security, Config, Exception)
│   │   │   ├── user/            # 사용자 관리
│   │   │   ├── notice/          # 공지사항
│   │   │   ├── website/         # 웹사이트 설정
│   │   │   ├── collection/      # 소장품
│   │   │   ├── exhibition/      # 전시
│   │   │   └── souvenir/        # 기념품
│   │   └── resources/
│   │       ├── application.properties          # 공통 설정
│   │       ├── application-local.properties    # 로컬 설정
│   │       ├── application-prod.properties     # 프로덕션 설정
│   │       └── db/migration/                   # Flyway 마이그레이션
│   └── test/
├── deployment/                   # 배포 스크립트
│   ├── README.md                # 배포 가이드
│   ├── setup.sh                 # 초기 설정
│   ├── deploy.sh                # 배포 스크립트
│   ├── start-prod.sh            # 프로덕션 시작
│   ├── stop.sh                  # 서비스 중지
│   ├── status.sh                # 상태 확인
│   ├── setup-ssl.sh             # HTTPS 설정
│   ├── yasong-art-gallery.service  # Systemd 서비스
│   └── nginx/                   # Nginx 설정
├── .env.example                 # 환경 변수 예제
├── pom.xml                      # Maven 설정
└── README.md                    # 이 파일
```

## 🔒 보안

### 프로덕션 체크리스트

- [ ] `.env` 파일에 강력한 JWT_SECRET 설정
- [ ] 데이터베이스 비밀번호 변경
- [ ] 초기 관리자 비밀번호 변경
- [ ] HTTPS 설정 완료
- [ ] 방화벽 설정 (포트 8080 제한)
- [ ] 정기적인 백업 설정

보안 가이드: [deployment/ENV_SETUP_GUIDE.md](deployment/ENV_SETUP_GUIDE.md)

## 🧪 테스트

```bash
# 전체 테스트 실행
./mvnw test

# 특정 테스트 실행
./mvnw test -Dtest=YasongmuseumApplicationTests
```

## 📦 빌드

```bash
# JAR 파일 생성
./mvnw clean package

# 테스트 없이 빌드
./mvnw clean package -DskipTests

# 빌드된 파일 위치 (버전 없는 고정 파일명)
target/yasong-art-gallery.jar
```

## 🐛 문제 해결

### 데이터베이스 연결 실패

```bash
# MySQL 서비스 상태 확인
sudo systemctl status mysql

# 포트 확인
netstat -an | grep 3306

# .env 파일의 DB_URL, DB_USERNAME, DB_PASSWORD 확인
```

### 애플리케이션 시작 실패

```bash
# 로그 확인
sudo journalctl -u yasong-art-gallery -n 50

# 또는 직접 실행하여 에러 확인
java -jar yasong-art-gallery.jar --spring.profiles.active=prod
```

### 포트 이미 사용 중

```bash
# 8080 포트 사용 프로세스 확인
lsof -i :8080

# 프로세스 종료
kill -9 <PID>
```

## 📊 성능 최적화

현재 설정은 **1GB RAM 서버에 최적화**되어 있습니다:

- JVM Heap: 256MB ~ 512MB
- Metaspace: 128MB ~ 256MB
- HikariCP 커넥션 풀: 최대 5개
- Tomcat 스레드: 최대 50개

더 많은 리소스가 있다면 [application-prod.properties](src/main/resources/application-prod.properties) 에서 조정하세요.

## 🤝 기여

이슈나 풀 리퀘스트를 환영합니다!

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 📞 문의

- **GitHub:** [@bang9634](https://github.com/bang9634)
- **Email:** bang9634@example.com

---

Made with ❤️ by bang9634
