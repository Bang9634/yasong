# Yasong Museum

프런트와 백엔드를 함께 관리하고, 한 번의 빌드로 실행 가능한 JAR를 만드는 모노레포입니다.

```text
frontend/                React / Vite
backend/                 Java 21 / Spring Boot / Maven Wrapper
scripts/build.sh         프런트 빌드 → 테스트 → JAR → 패키지 검증
deployment/              Ubuntu systemd 배포 및 운영 가이드
.github/workflows/       PR·main 빌드와 수동 운영 배포
```

## 개발과 빌드

Node.js 22, JDK 21, Python 3가 필요합니다. Maven은 backend의 Wrapper를 사용합니다.

```bash
nvm use
cp backend/src/main/resources/application-local.properties.example backend/src/main/resources/application-local.properties
# 위 로컬 설정을 자신의 개발 DB와 키로 수정합니다. 운영 자격증명을 넣지 않습니다.
./scripts/build.sh
```

테스트에는 별도의 개발 DB가 필요합니다. CI는 일회용 MySQL 8.4를 자동 생성하고 무작위 테스트 JWT 키를 사용합니다. 로컬 테스트에 운영 DB를 연결하지 마세요. 빌드 결과는 `backend/target/yasong-art-gallery.jar`입니다.

프런트만 개발할 때:

```bash
cd frontend
npm ci
npm run dev
```

백엔드만 개발할 때는 backend 디렉토리에서 `./mvnw spring-boot:run`을 실행합니다. 프런트 개발 서버는 `.env.development`의 API 주소를 사용합니다. 통합 JAR는 `/api`를 같은 도메인으로 호출합니다.

프런트 `dist`는 Maven 리소스 단계에서 JAR의 `static/`에 들어갑니다. `dist`와 백엔드 `static`에 빌드 파일을 복사하거나 커밋하지 않습니다. 배포용 빌드는 루트의 `scripts/build.sh`로 실행해야 하며, `mvn package`만 따로 실행하면 프런트 빌드가 갱신되지 않습니다.

`VITE_*` 값은 브라우저에 공개됩니다. 프런트 환경파일의 API 주소와 지도 클라이언트 ID는 공개 설정이며, DB 비밀번호나 JWT 키를 넣으면 안 됩니다. 지도 ID를 CI에서 바꾸려면 저장소 변수 `NAVER_MAP_CLIENT_ID`를 사용합니다.

## CI/CD

PR과 main push는 프런트 빌드, Java 테스트, JAR 검증, 실제 JAR의 HTTP·DB 연결 점검을 실행합니다. 운영 서버에는 자동 배포하지 않습니다.

서버와 GitHub 설정을 완료한 뒤 Actions → Build and deploy → Run workflow → main → deploy 체크로 운영 배포합니다. 빌드된 JAR와 체크섬은 Actions artifact에 14일간 보관됩니다. 실행 중인 서버와 업로드 파일은 서버에 남으므로 artifact 보관 기간과 별개입니다.

실제 초기 설정과 배포 권한은 [배포 가이드](deployment/README.md), Java 편집기 오류 해결은 [Java 개발 가이드](deployment/JAVA_DEVELOPMENT.md)를 참고하세요.

## 저장소 이력

백엔드 원본 이력을 유지하고 프런트의 master를 squash 없이 subtree merge했습니다. 원래 커밋의 SHA·작성자·메시지는 보존됩니다. 과거 파일은 당시의 루트 경로로 남고 현재 파일만 frontend/backend로 나뉩니다. 원래 GitHub 저장소의 PR·이슈·설정은 이동되지 않습니다.

- backend 원본: `https://github.com/Bang9634/yasong-museum-backend.git`
- frontend 원본: `https://github.com/Bang9634/yasong-museum-frontend.git`
- backend 기준 커밋: c7bc20721786726e63df8a3800a56dcfcbdf5beb
- frontend 가져온 커밋: 69c880eb5db9a8fb02fb3139618e09e69741a44b

```bash
git merge-base --is-ancestor c7bc20721786726e63df8a3800a56dcfcbdf5beb HEAD
git merge-base --is-ancestor 69c880eb5db9a8fb02fb3139618e09e69741a44b HEAD
git log --graph --oneline --all
```

두 is-ancestor 명령이 모두 exit 0이면 두 이력이 통합 브랜치에 연결된 것입니다. 현재 로컬 원본은 각각 main/master 한 브랜치이며 태그가 없습니다. 원격에만 있는 다른 브랜치는 별도 확인·가져오기가 필요합니다. 새 저장소를 사용한다면 그 저장소로 통합 브랜치를 push한 뒤 main으로 검토·병합하세요. 기존 두 저장소는 통합 확인 후 보관용으로 유지합니다. 기존 저장소 삭제나 force push는 필요하지 않습니다.
