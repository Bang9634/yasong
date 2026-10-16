# Backend

[프로젝트 소개·설치·실행](../README.md) · [운영 배포](../deployment/README.md)

Java 21 / Spring Boot 4 기반 REST API입니다. Spring Security와 JWT로 인증·권한을 처리하며, MySQL 스키마는 Flyway로 관리합니다.

## 구조

`src/main/java/com/bang9634/yasongmuseum/` 아래에 도메인별로 구성되어 있습니다.

| 영역 | 책임 |
| --- | --- |
| auth · user | 로그인, 사용자·권한 관리 |
| notice · collection · exhibition · contest · photo | 공지·소장품·전시·공모전·사진 |
| website · legal · updatelog · analytics | 사이트 설정·약관·업데이트·통계 |
| common | 공통 응답·예외, 인증, 파일 경로·저장 처리 |

DB 변경은 `src/main/resources/db/migration/`, Java 테스트는 `src/test/java/`에 있습니다. 이미 적용한 마이그레이션은 수정하지 않고 새 파일로 변경을 추가합니다.

## API 안내

| 구분 | 경로 예시 |
| --- | --- |
| 로그인·사용자 등록 | `/api/auth/login`, `/api/auth/signup` |
| 현재 사용자 | `/api/users/me` |
| 공개 콘텐츠 | `/api/notices`, `/api/collections`, `/api/exhibitions`, `/api/contests`, `/api/photos` |
| 콘텐츠 관리 | `/api/management/**` |
| 사용자·통계 관리 | `/api/admin/users`, `/api/admin/analytics` |

운영자 기능은 역할별 접근 권한을 요구합니다. 실제 요청·응답과 권한은 각 도메인의 `controller/`, `dto/` 및 [SecurityConfig](src/main/java/com/bang9634/yasongmuseum/common/config/SecurityConfig.java)를 기준으로 확인합니다.

## 개발 DB

새 개발 환경이라면 MySQL 관리자 계정으로 접속해 아래와 같이 준비합니다. `REPLACE_WITH_LOCAL_PASSWORD`는 실행 전에 자신의 개발용 비밀번호로 바꾸고, 기존 계정/DB가 있다면 재생성하지 않습니다.

```sql
CREATE DATABASE yasongmuseum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'yasongmuseum'@'localhost' IDENTIFIED BY 'REPLACE_WITH_LOCAL_PASSWORD';
GRANT ALL PRIVILEGES ON yasongmuseum.* TO 'yasongmuseum'@'localhost';
```

이 접속 정보를 로컬 properties에 입력합니다. DB가 다른 서버에 있다면 실제 주소와 접속 허용 정책에 맞게 계정을 준비합니다.

## 설정

- 공통값: [application.properties](src/main/resources/application.properties)
- 로컬: [로컬 설정 예시](src/main/resources/application-local.properties.example)를 복사해 사용. 루트의 실행 스크립트가 외부 설정으로 읽습니다.
- 운영: [application-prod.properties](src/main/resources/application-prod.properties)가 환경변수를 참조하며, 서버 systemd가 `.env`를 읽습니다. [운영 환경변수 예시](.env.example)는 로컬 자동 로딩 파일이 아닙니다.
- IDE/Maven에서 직접 실행할 때는 `local` 프로필, `SPRING_CONFIG_ADDITIONAL_LOCATION=file:/절대경로/application-local.properties`, `FILE_UPLOAD_DIR=/절대경로/uploads` 및 필요한 JWT 키를 지정합니다.

통계 기능의 선택 설정은 `google.analytics.property-id`, `google.analytics.credentials-path`입니다. 운영에서는 각각 `GA_PROPERTY_ID`, `GA_CREDENTIALS_PATH`에 대응합니다. [Google Analytics 설정 안내](GOOGLE_ANALYTICS_SETUP.md)를 참고하고 자격증명 JSON은 저장소 밖에 둡니다.

## 빌드와 테스트

프런트까지 포함하는 빌드는 저장소 루트에서 `./scripts/build.sh`로 수행합니다. `mvn package`만 실행하면 프런트 빌드가 갱신되지 않습니다. 산출물은 `target/yasong-art-gallery.jar`입니다.

DB 없이 실행 가능한 파일 경로·다운로드 단위 테스트 예시입니다. 아래 명령은 `backend/` 기준입니다.

```bash
./mvnw -Dtest=UploadStoragePathsTest,FileDownloadControllerTest test
```

전체 통합 테스트는 개발/일회용 MySQL과 설정이 필요합니다. CI는 MySQL 8.4를 별도로 생성하며, 운영 DB나 자격증명은 사용하지 않습니다. 로컬 전체 검증 절차는 [루트 README](../README.md#설치와-로컬-실행)를 따릅니다.

## Java 편집기 오류

`Flexible Constructor Bodies` 또는 Java 25 요구 오류가 표시되면 먼저 JDK 21에서 `./mvnw clean compile`로 실제 컴파일 결과를 확인합니다. 위 명령은 `backend/` 기준입니다. 컴파일은 성공하고 IDE에만 오류가 남으면 Java 확장과 Lombok의 호환성을 점검하고 언어 서버 작업 공간을 정리합니다.

2026-10-16에는 VS Code Java 확장 1.57.0과 포함된 Lombok 조합에서 관련 문제가 확인되었습니다. [공식 이슈](https://github.com/redhat-developer/vscode-java/issues/4521)와 현재 설치 버전의 수정 여부를 확인하세요. 과거 우회 버전으로 무조건 내리거나, 편집기 오류를 없애려고 프로젝트의 Java 버전을 25로 올리지 않습니다.
