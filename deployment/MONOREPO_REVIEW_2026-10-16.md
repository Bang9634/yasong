# 모노레포 통합 재검토

검토일: 2026-10-16 (Asia/Seoul)

## 판정

두 기본 브랜치의 Git 이력과 소스는 보존되어 있다. 다만 최초 통합에는 업로드 상대경로 및 로컬 설정 자동 로드가 빠져 있었고, 재검토에서 이를 수정했다. 아래 검증 범위에서 수정 후 빌드·개발 실행·통합 JAR 실행·파일 처리 회귀 오류는 발견되지 않았다. 모든 기능·운영 환경·보안 문제가 없다는 보장은 아니다.

## 이력과 소스 비교

- backend 기준 커밋 `c7bc20721786726e63df8a3800a56dcfcbdf5beb`와 frontend 기준 커밋 `69c880eb5db9a8fb02fb3139618e09e69741a44b` 모두 현재 main의 조상이다.
- 기존 백엔드 src 파일 149개(중복된 static 빌드 산출물 제외), 프런트 src 파일 116개를 현재 파일과 대조했고 누락은 없다.
- 주요 Java 비즈니스 로직은 이동한 원본을 유지했다. 새 검토에서는 저장 경로를 처리하는 공통 서비스·WebConfig·다운로드 컨트롤러 및 관련 설정/테스트를 보완했다.
- 프런트 원본에 이미 삭제된 SouvenirsPage와 DirectorIntro를 가리키는 미사용 import가 남아 있었다. Vite production tree shaking은 이를 숨길 수 있어 두 import를 제거하고 로컬 import 존재 검사를 빌드에 추가했다.
- 병합 충돌 표시는 현재 소스와 실행 설정에서 발견되지 않았다.

## 발견 및 수정

| 항목 | 기존 문제 | 수정 |
| --- | --- | --- |
| uploads 위치 | backend에서 실행하면 backend/uploads를 사용하여 기존 루트 파일을 못 찾음 | 로컬 실행 스크립트에서 FILE_UPLOAD_DIR를 루트 uploads의 절대 경로로 지정 |
| 물리 경로와 URL | uploadDir를 URL에도 붙여 절대 경로 설정 시 URL까지 잘못됨 | 물리 저장 경로와 /uploads/ 공개 URL을 분리 |
| 파일 제공/다운로드/삭제 | 저장 설정과 별개로 file:uploads/ 및 현재 디렉토리 상대 경로 사용 | UploadStoragePaths를 공통으로 사용하고 업로드 루트 밖 상대 경로 거부 |
| 로컬 설정 | 보안상 JAR에서 제외한 local properties를 실행 시 자동 로드하지 않음 | build/dev/run 스크립트가 local 프로필에서 외부 파일로 읽음. prod에서는 자동 추가하지 않음 |
| production 시작 스크립트 | 루트 target의 예전 JAR를 실행할 수 있음 | 설치된 systemd 서비스 시작으로 통일 |
| 문서 | 단순 mvnw 실행 및 예전 설정 복사 방법 안내 | 새 실행 스크립트, 외부 설정, 저장 경로, 덮어쓰기 방지 설명 반영 |

## uploads 규칙

```text
로컬 권장 실행: <저장소 루트>/uploads/
운영 systemd: /home/yasong-art-gallery/uploads/
공개 URL: /uploads/<하위폴더>/<파일명>
```

경로를 바꾸려면 FILE_UPLOAD_DIR에 절대 경로를 지정한다. DB의 기존 /uploads/... URL은 바꾸지 않는다. root uploads 파일 101개를 검사 전후 SHA-256으로 비교했고 동일했다. 기존 파일 이동·삭제·새 파일 추가를 하지 않았다. root target은 예전 빌드 산출물이며 현재 빌드/실행은 backend/target을 사용한다.

IDE나 backend에서 Maven을 직접 실행하면서 FILE_UPLOAD_DIR를 생략하면 기본 uploads는 여전히 프로세스 작업 디렉토리 기준이다. 따라서 루트 실행 스크립트를 사용하거나 IDE에도 절대 경로를 지정해야 한다.

## 실행 검증

- Node 22 + JDK 21로 scripts/build.sh: 성공.
- Java 소스 133개 clean compile: 성공.
- JUnit 10개: 실패 0, 오류 0. 외부 저장 폴더의 이미지 HTTP 제공, Vite CORS preflight, 두 첨부파일 유형 다운로드, 삭제 및 경로 거부 포함.
- Python/Linux 테스트 16개: 성공. 배포 성공·실패·롤백·동시 실행 제한 10개, 로컬 설정/경로 3개, CI의 실제 셸 블록(테스트 JWT 생성·체크섬·SSH 파일 형식) 3개.
- actionlint, shellcheck, Python AST, bash -n, git diff --check: 성공.
- JAR 내용: frontend/dist 전체와 바이트 단위 비교, 참조 JS/CSS 포함, local/dev properties 및 비밀파일 제외 확인.
- local 프로필: 임시 로컬 설정 + 일회용 MySQL에서 dev-backend.sh 실행 및 DB schema validate 성공.
- Vite 개발 서버: main.tsx, App.tsx, HomePage.tsx 변환 성공. 브라우저 홈 화면 표시 및 오류 로그 0개 확인.
- 통합 JAR: 브라우저 홈/공지 페이지 표시, 직접 진입 SPA 경로 5개, 번들 JS/CSS 응답 확인.
- DB 조회 공개 목록: notices/collections/exhibitions/contests/photos/updates 6개 성공.
- 일회용 DB의 관리자 로그인, 공지 작성, 첨부 업로드·직접 조회·다운로드·삭제, 공지 삭제 성공.
- 이미지 업로드·HTTP 조회·교체 및 이전 이미지 파일 정리 성공.

모든 변경 테스트는 임시 포트, 임시 uploads, Docker의 일회용 MySQL에서 수행했다. 기존 로컬 DB나 운영 DB·서버·업로드에는 변경 요청을 하지 않았다.

## 남은 범위와 운영 확인

- GitHub에서 실제 workflow 실행 및 운영 SSH 배포는 하지 않았다. GitHub production 환경의 키/known_hosts/변수와 서버 sudo/unit 설정은 기존 배포 가이드대로 최초 설정 후 확인해야 한다.
- Google Analytics, 지도 등 실제 외부 서비스 자격증명 및 실데이터는 검증하지 않았다.
- 전체 TypeScript strict 타입 검사는 기존 프로젝트에 설정되어 있지 않다. 이번에는 local import 검사, Vite 빌드/개발 변환과 브라우저 확인을 수행했다.
- 기존의 Lombok Builder 기본값, 중복 SLF4J provider, Flyway의 MySQL 8.4 검증 버전 경고는 남아 있지만 이번 테스트 실패 원인은 아니었다. 의존성 업데이트와 해당 경고는 별도 작업이다.
- 이전 setup.sh/setup-env.sh 및 예전 환경변수·HTTPS 문서는 이전 배포 방식의 자료다. 이 스크립트/문서의 오래된 경로를 새 CI/CD에 혼용하지 않고 deployment/README.md를 기준으로 한다.
- 이전 보안 검토에서 찾은 기본 관리자, 비공개 첨부 권한, 저장형 XSS, 토큰 폐기 등의 문제는 모노레포 이동만으로 해결되지 않는다. 이번 변경에서 다룬 파일 경로 처리와 별도로 수정이 필요하다.
- 이번 수정은 main 작업 트리에 남겨 두며 자동 커밋·push·운영 배포하지 않는다.

## 현재 실행 방법

저장소 루트에서 백엔드 개발은 `./scripts/dev-backend.sh`, 프런트는 별도 터미널의 frontend에서 `npm run dev`를 사용한다. 최초 프런트 의존성은 Node 22에서 npm ci로 설치한다. 통합 실행은 `./scripts/build.sh` 후 `./scripts/run-local.sh`를 사용한다. DB 접속과 유효한 JWT 키는 Git에서 제외된 로컬 properties 또는 환경변수에 설정해야 한다.
