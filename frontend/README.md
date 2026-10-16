# Frontend

[프로젝트 소개·설치·실행](../README.md) · [운영 배포](../deployment/README.md)

React 18 / Vite 6 / Tailwind CSS 4 기반 웹 화면입니다. Node.js 22와 npm을 사용하며 의존성은 `package-lock.json`으로 고정합니다.

## 구조

| 경로 | 역할 |
| --- | --- |
| `src/app/App.tsx` | 페이지 라우팅 |
| `src/app/components/` | 공개 화면, 콘텐츠 작성·수정 화면 |
| `src/app/components/admin/` | 사용자·사이트 설정·통계 등 관리 화면 |
| `src/app/components/common/`, `ui/` | 공통 첨부파일 및 UI 구성요소 |
| `src/context/`, `src/utils/` | 인증 상태, API 클라이언트, 이미지·SEO 처리 |
| `src/styles/`, `public/` | 스타일과 URL로 직접 제공하는 정적 파일 |

## 개발과 빌드

아래 명령은 `frontend/` 기준입니다. API를 사용하는 화면은 백엔드도 함께 실행해야 합니다.

```bash
npm ci
npm run dev
```

개발 주소는 기본 `http://localhost:5173`입니다. `npm run build`는 프런트만 `dist/`에 빌드합니다. 테스트와 JAR 패키징을 포함한 전체 빌드는 저장소 루트의 `./scripts/build.sh`를 사용합니다.

## 환경변수

현재 API 클라이언트는 `VITE_API_BASE_URL`을 사용합니다. 로컬 기본값은 `.env.development`의 `http://localhost:8080`이며, 통합 빌드 스크립트는 빈 값으로 설정해 같은 출처의 `/api`를 호출하게 합니다.

개인 개발 환경에서 변경하려면 [.env.example](.env.example)을 `.env.development.local`로 복사해 수정합니다. 독립적인 프런트 운영 빌드에 별도 API 주소가 필요한 경우 `.env.production.local`을 사용합니다. 이미 존재하는 로컬 파일은 덮어쓰지 않습니다.

Vite를 시작한 셸의 환경변수는 파일보다 우선합니다. 변경 후 개발 서버를 재시작하거나 다시 빌드해야 하며, 백엔드 서버의 `.env`만 변경해서는 프런트 설정이 바뀌지 않습니다. `VITE_*`는 브라우저에 공개되므로 비밀값을 넣지 않습니다. [Vite 환경변수 안내](https://vite.dev/guide/env-and-mode)

## 라이선스

`src/app/components/ui/`에는 [shadcn/ui](https://ui.shadcn.com/) 기반 코드가 포함되어 있습니다. 해당 코드의 저작권 고지와 MIT 허가문은 [루트 LICENSE](../LICENSE)에 보존합니다. 이는 웹사이트 전체 디자인의 출처를 뜻하지 않습니다.

프로젝트 라이선스와 콘텐츠 권리 구분은 [루트 README](../README.md#라이선스와-출처)를 참고합니다. 설치된 외부 패키지는 각 패키지의 라이선스를 따릅니다.
