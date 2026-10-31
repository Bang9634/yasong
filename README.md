# Yasong

야송 이원좌 화백의 작품과 관련 공모전 및 전시 정보를 제공하고, 운영자가 콘텐츠를 관리하는 웹사이트입니다. React 프런트엔드와 Spring Boot 백엔드를 하나의 저장소에서 관리하며, 통합 빌드 결과를 실행 가능한 JAR로 배포합니다.

서비스: [yasong.co.kr](https://yasong.co.kr) · 저장소: [Bang9634/yasong](https://github.com/Bang9634/yasong)

본 서비스는 정보 제공과 연구·포트폴리오를 목적으로 개인이 비영리로 운영하는 디지털 아카이브이며, 군립 청송야송미술관의 공식 홈페이지가 아닙니다. 자세한 내용은 [이용약관](https://yasong.co.kr/legal/terms)을 참고해 주세요.

## 주요 기능

- 미술관·작가 소개, 소장품·전시·공모전·사진 자료 조회
- 공지사항과 첨부파일, 약관 및 업데이트 내역 제공
- 운영자 콘텐츠·이미지 관리, 사용자·권한 관리
- Google Analytics 기반 관리자 통계 조회: 별도 자격증명 설정 필요

## 프로젝트 구조

| 경로 | 역할 |
| --- | --- |
| [frontend/](frontend/README.md) | React 18 · Vite 6 · Tailwind CSS 4 |
| [backend/](backend/README.md) | Java 21 · Spring Boot 4 · MySQL · Flyway |
| [deployment/](deployment/README.md) | Ubuntu · systemd 배포와 운영 |
| scripts/ | 로컬 실행, 통합 빌드, 패키지 검사 |
| tests/ | Python 기반 실행·배포 스크립트 테스트 |
| .github/workflows/ | GitHub Actions 빌드·테스트·수동 운영 배포 |

## 설치와 로컬 실행

**필수 환경:** JDK 21, Node.js 22, Python 3, MySQL, Git, OpenSSL. MySQL은 CI와 같은 8.4 사용을 권장합니다. Maven은 저장소의 Wrapper를 사용합니다.

### 1. 소스와 개발 DB 준비

```bash
git clone https://github.com/Bang9634/yasong.git
cd yasong
```

nvm을 사용한다면 `nvm install`과 `nvm use`로 Node.js 버전을 맞춥니다. MySQL에는 개발용 `yasongmuseum` DB와 해당 DB에 테이블·인덱스를 생성/변경할 수 있는 개발 계정을 준비합니다. [개발 DB 준비 예시](backend/README.md#개발-db)를 참고하세요. 테이블 변경은 Flyway가 수행합니다. 운영 DB를 로컬 개발이나 테스트에 사용하지 않습니다.

### 2. 로컬 설정 준비

```bash
cp -n backend/src/main/resources/application-local.properties.example backend/src/main/resources/application-local.properties
```

복사한 파일의 DB 주소·계정·비밀번호를 개발 환경에 맞춥니다. `jwt.secret=${JWT_SECRET}` 설정은 유지합니다. 기존 로컬 파일은 덮어쓰지 않으며, 설정 파일과 실제 비밀값은 커밋하지 않습니다.

### 3. 백엔드와 프론트엔드 실행

첫 번째 터미널에서 저장소 루트 기준으로 실행합니다.

```bash
export SPRING_PROFILES_ACTIVE=local
export JWT_SECRET="$(openssl rand -base64 64 | tr -d '\n')"
./scripts/dev-backend.sh
```

다른 터미널에서 실행합니다.

```bash
cd frontend
npm ci
npm run dev
```

[http://localhost:5173](http://localhost:5173)에 접속합니다. 백엔드는 기본적으로 `http://localhost:8080`에서 실행됩니다.

### 4. 통합 빌드 확인

개발 DB가 실행 중이고 위의 로컬 프로필·JWT 환경변수가 설정된 터미널에서, 기존 백엔드를 종료한 뒤 저장소 루트 기준으로 실행합니다.

```bash
./scripts/build.sh
./scripts/run-local.sh
```

빌드·Java 테스트·패키지 검사를 통과하면 `backend/target/yasong-art-gallery.jar`가 생성됩니다. 통합 실행은 [http://localhost:8080](http://localhost:8080)에서 확인하며, 별도 프런트 개발 서버는 필요하지 않습니다. 프런트 빌드 파일을 백엔드에 수동 복사하지 않습니다.

## 환경설정과 업로드

| 구분 | 설정 위치 | 적용 시점 |
| --- | --- | --- |
| 로컬 백엔드 | `backend/src/main/resources/application-local.properties`와 환경변수 | 백엔드 시작 |
| 운영 백엔드 | 서버의 `.env`를 systemd가 읽음 | 서비스 시작 |
| 프런트엔드 | `frontend/.env.development`, `.env.production`, 모드별 로컬 설정 | 개발 서버 시작·빌드 |

`.env.example`은 참고용이며 직접 읽히지 않습니다. 로컬 실행 스크립트도 루트나 백엔드의 `.env`를 자동으로 읽지 않습니다. `VITE_*`는 브라우저에 공개되는 설정이므로 비밀값을 넣지 않습니다.

로컬 스크립트의 업로드 저장소는 저장소 루트의 `uploads/`입니다. 다른 위치는 `FILE_UPLOAD_DIR` 절대 경로로 지정합니다. 업로드 데이터는 Git이나 JAR에 포함하지 않으며 별도로 백업해야 합니다.

## 배포와 문서

main 푸시와 PR은 빌드·테스트를 수행합니다. 운영 배포는 **Actions → Build and deploy → Run workflow → main → deploy 체크**로 시작합니다. 서버 설정은 [배포 안내](deployment/README.md)를 따릅니다.

- [백엔드 구조와 설정](backend/README.md)
- [프런트엔드 구조와 설정](frontend/README.md)
- [버전별 변경 내역 · GitHub Releases](https://github.com/Bang9634/yasong/releases)
- [1.6.0까지의 변경 기록](CHANGELOG.md)
- [서버 준비·배포·복구](deployment/guides/production.md)
- [Java 개발 환경 문제 해결](backend/README.md#java-편집기-오류)
- [AI 작업 지침](AGENTS.md)

프런트엔드와 백엔드의 기존 Git 커밋 이력은 모노레포 통합 과정에서 보존했습니다.

## 라이선스와 출처

별도 표기가 없는 프로젝트 소스코드와 개발 문서는 [MIT License](LICENSE)를 따릅니다. 작품 이미지·사진·로고 등 콘텐츠에는 이 라이선스를 일괄 적용하지 않습니다. 외부 코드와 라이브러리는 각각의 라이선스를 따르며, UI 코드 출처는 [프런트엔드 README](frontend/README.md#라이선스)에 있습니다.
