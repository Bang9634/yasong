# 배포

프런트는 모노레포의 `scripts/build.sh`와 GitHub Actions로 백엔드와 함께 빌드·배포합니다. dist를 backend의 static 폴더에 수동 복사하지 않습니다.

- 전체 빌드: 저장소 루트에서 `./scripts/build.sh`
- 프런트 개발: 이 폴더에서 `npm ci` 후 `npm run dev`
- 운영 배포: [루트 배포 가이드](../deployment/README.md)

프런트 환경변수는 브라우저에 포함됩니다. 비밀값을 VITE_*에 넣지 마세요.
