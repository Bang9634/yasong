# Ubuntu 배포 설정

이 문서는 모노레포 CI/CD의 기준입니다. 기존 setup.sh/start-prod.sh/setup-env.sh 및 예전 HTTPS·환경변수 문서는 이전 수동 배포용으로 경로·서비스 이름이 다를 수 있으므로 이 절차와 섞어 실행하지 마세요. DB와 Nginx를 새로 설치하거나 기존 .env를 재생성할 필요는 없습니다.

## 1. 운영 설정 확인 (최초 1회)

현재 구성은 아래 경로와 이름을 사용합니다. 실제 서버가 다르면 workflow, deploy.sh, systemd 파일을 함께 조정하세요.

| 항목 | 값 |
| --- | --- |
| 실행 및 SSH 배포 계정 | yasong-art-gallery |
| 서비스 | yasong-art-gallery.service |
| 앱 디렉토리 | /home/yasong-art-gallery |
| 비밀 설정 | /home/yasong-art-gallery/.env |
| 실행 JAR | /home/yasong-art-gallery/yasong-art-gallery.jar |
| 업로드 파일 | /home/yasong-art-gallery/uploads |
| Nginx upstream | 127.0.0.1:8080 |

JDK 21, Python 3, OpenSSH/SFTP, util-linux(flock), coreutils가 필요합니다. 서버에서는 npm이나 Maven 빌드를 실행하지 않습니다.

기존 .env에 JWT_SECRET, DB_URL, DB_USERNAME, DB_PASSWORD가 있어야 합니다. JWT_SECRET의 공개 기본값은 제거했습니다. 기존 서버에 설정한 별도 키를 그대로 사용하세요. systemd 환경파일에는 `export`를 쓰지 않고 `KEY=value` 형식을 사용합니다. 값은 로그나 Git에 출력하지 않습니다.

앱 계정이 releases/incoming/logs/uploads를 쓸 수 있도록 관리자 계정에서 설정합니다. 기존 업로드 파일은 삭제하거나 덮어쓰지 않습니다.

```bash
sudo install -d -o yasong-art-gallery -g yasong-art-gallery -m 750 /home/yasong-art-gallery/releases /home/yasong-art-gallery/incoming /home/yasong-art-gallery/logs /home/yasong-art-gallery/uploads
sudo chown yasong-art-gallery:yasong-art-gallery /home/yasong-art-gallery/.env
sudo chmod 600 /home/yasong-art-gallery/.env
```

`deployment/yasong-art-gallery.service`를 실제 서버 환경과 비교한 뒤 설치합니다. 새 unit은 prod와 loopback 8080을 명시하므로 Nginx를 통해 접속해야 합니다. 외부 클라이언트가 8080에 직접 접속하고 있다면 먼저 Nginx 경로로 전환해야 합니다.

```bash
sudo cp deployment/yasong-art-gallery.service /etc/systemd/system/yasong-art-gallery.service
sudo systemctl daemon-reload
sudo systemctl enable yasong-art-gallery.service
```

unit 교체는 다음 재시작부터 적용됩니다. 기존 서비스 파일과 .env는 관리자만 접근 가능한 위치에 별도로 백업해두세요. SSH 계정의 홈 및 앱 디렉토리 자체를 계정이 쓸 수 있어야 합니다. 앱 실행 계정의 셸이 nologin이면 SSH를 허용할 전용 배포 계정/권한 설계가 필요합니다.

## 2. 배포용 SSH 키와 sudo

CI용 SSH 키를 새로 만들고 공개키를 배포 계정의 authorized_keys에 등록합니다. 개인키는 GitHub의 production environment secret `DEPLOY_SSH_KEY`에 저장합니다. 기존 개인 SSH 키를 재사용하지 않는 편이 좋습니다.

sudo 권한은 visudo로 아래 세 명령에만 부여합니다. 서비스 계정으로 sudo가 실제 작동하는지 서버에서 검증하세요. 이 키는 앱 배포 권한을 가지므로 production secret에 접근할 수 있는 워크플로와 main 브랜치도 보호해야 합니다.

```sudoers
yasong-art-gallery ALL=(root) NOPASSWD: /usr/bin/systemctl restart yasong-art-gallery.service, /usr/bin/systemctl stop yasong-art-gallery.service, /usr/bin/systemctl is-active --quiet yasong-art-gallery.service
```

```bash
sudo -u yasong-art-gallery sudo -n /usr/bin/systemctl is-active --quiet yasong-art-gallery.service
```

## 3. GitHub의 production 환경

Settings → Environments → production에 다음을 설정합니다.

| 종류 | 이름 | 내용 |
| --- | --- | --- |
| Secret | DEPLOY_SSH_KEY | 배포 전용 SSH 개인키 전체 |
| Secret | DEPLOY_KNOWN_HOSTS | 서버 호스트 키를 담은 known_hosts 행 |
| Variable | DEPLOY_HOST | 서버 IPv4 주소 또는 DNS 이름 |
| Variable | DEPLOY_USER | yasong-art-gallery |
| Variable | DEPLOY_PORT | SSH 포트, 생략하면 22 |

호스트 키는 신뢰할 수 있는 서버 콘솔/관리 경로에서 fingerprint를 확인해 등록합니다. 출처를 검증하지 않은 ssh-keyscan 결과를 그대로 신뢰하면 중간자 공격을 막을 수 없습니다. 비표준 포트는 `[hostname]:port` 형식의 known_hosts 항목이 필요합니다.

DB 비밀번호와 JWT_SECRET은 서버의 기존 .env에만 두면 됩니다. CI 테스트에는 별개의 일회용 자격증명을 사용합니다. GitHub 환경의 배포 허용 브랜치는 main으로 제한하고 가능하면 필수 승인자를 설정합니다. 저장소 main도 PR 검사를 통과해야 병합되게 설정하세요.

## 4. 배포 버튼

Actions → Build and deploy → Run workflow → main 선택 → deploy 체크 → 실행합니다. 다른 브랜치에서는 빌드만 가능하고 운영 배포 job은 실행되지 않습니다. SSH가 클라우드 방화벽/보안 그룹에서 CI runner에 허용되어 있어야 합니다. 이를 위해 SSH를 전 세계에 무작정 개방하지 말고 조직의 VPN/runner 접근 정책을 사용하세요.

빌드/테스트 성공 후 체크섬을 검증하고 새 JAR를 releases에 보관합니다. 기존 JAR가 일반 파일인 최초 전환에서도 새 JAR 설치 전에 실제 구버전을 백업합니다. 실행 경로를 새 릴리스에 대한 symlink로 원자적으로 바꾸고 재시작합니다. .env와 uploads는 릴리스 밖에 그대로 유지합니다.

정상 여부는 단순 프로세스 실행 상태가 아니라 새 JAR와 동일한 index.html 응답과 DB를 조회하는 공개 공지 API로 확인합니다. 120초 안에 정상화되지 않으면 이전 JAR로 복구하고 재시작합니다. 기존 상태가 중지였다면 실패 시 다시 중지합니다. 서버의 flock과 GitHub concurrency로 배포가 겹치지 않게 합니다.

단일 인스턴스 재시작 배포이므로 짧은 중단이 있습니다. Flyway로 적용된 DB 변경은 JAR 롤백으로 되돌리지 않습니다. 이전 코드와 호환되는 마이그레이션, 배포 전 DB 백업이 필요합니다. 배포 중 서버 종료/SSH 연결 단절 등의 경우까지 복구가 보장되는 것은 아니므로 서버 상태도 확인하세요.

```bash
sudo systemctl status yasong-art-gallery.service
sudo journalctl -u yasong-art-gallery.service -n 100 --no-pager
readlink -f /home/yasong-art-gallery/yasong-art-gallery.jar
```

releases와 incoming은 자동 삭제하지 않습니다. 현재 실행 버전과 복구에 필요한 버전을 보존한 상태에서 오래된 파일을 정리하세요. GitHub artifact 보관 기간은 14일입니다.

## 수동 복구

현재 symlink를 확인하고, releases에서 검증된 이전 JAR를 선택하여 같은 배포 스크립트로 배포할 수 있습니다. 기존 releases의 커밋 SHA 또는 커밋SHA-runID-attempt를 release ID로 사용합니다. 자동 복구 실패, unit 변경, .env 변경은 관리자 확인이 필요하며, JAR 복구가 설정이나 DB를 되돌리지는 않습니다.
