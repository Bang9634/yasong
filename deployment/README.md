# Deployment

[프로젝트 메인 안내](../README.md) · [서버 준비·운영·복구 가이드](guides/production.md)

GitHub Actions에서 프런트와 백엔드를 빌드하고, Ubuntu 서버에 JAR를 전송한 뒤 systemd 서비스를 재시작합니다. 서버에서는 Node.js나 Maven 빌드가 필요하지 않습니다.

## 배포 실행

1. 서버·SSH 키·GitHub `production` 환경을 [운영 가이드](guides/production.md)에 맞춰 준비합니다.
2. 변경사항을 main에 반영합니다. 푸시와 PR은 빌드·테스트만 실행합니다.
3. **Actions → Build and deploy → Run workflow → main → deploy 체크**로 운영 배포를 시작합니다.
4. `build`와 `deploy`의 성공 여부를 확인하고 실제 사이트를 점검합니다. `deploy`가 Skipped이면 배포하지 않은 실행입니다.

## 구성요소

| 파일 | 역할 |
| --- | --- |
| [deploy.sh](deploy.sh) | 릴리스 보관, JAR 교체·서비스 재시작·실패 복구 |
| [check-ready.py](check-ready.py) | 새 화면과 DB 조회 API의 정상 응답 검사 |
| [yasong-art-gallery.service](yasong-art-gallery.service) | 앱 계정·환경파일·업로드 경로·실행 설정 |
| [nginx/](nginx/) | 프록시 설정 참고 자료. 실제 도메인·인증서와 대조 필요 |
| [워크플로](../.github/workflows/ci-cd.yml) | CI와 수동 운영 배포 정의 |

업로드와 서버 `.env`는 릴리스와 분리해 유지합니다. 정상 응답 확인에 실패하면 이전 JAR로 복구를 시도합니다. 단일 인스턴스 재시작이므로 짧은 중단이 있으며, JAR 복구는 DB 마이그레이션을 되돌리지 않습니다.

서버 초기 설정과 HTTPS 절차는 위 운영 가이드를 따릅니다. `start-prod.sh`, `stop.sh`, `status.sh`, `diagnose.sh`는 수동 운영용이며 자동배포에서는 호출하지 않습니다. `setup-swap.sh`는 서버 메모리 설정용, `ngrok-expose.sh`는 로컬 개발 서버 공유용입니다. 실제 서버 상태와 권한을 확인한 뒤 필요한 도구만 사용합니다.
