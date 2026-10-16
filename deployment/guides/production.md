# 서버 준비와 운영

[배포 안내](../README.md) · [프로젝트 메인 안내](../../README.md)

Ubuntu/systemd 기반 JAR 배포의 상세 절차입니다. 셸 명령은 별도 표기가 없으면 Ubuntu 서버의 관리자 계정에서 실행합니다. `deployment/` 상대 경로를 사용하는 명령은 현재 저장소의 해당 파일을 서버에 전달한 상태를 전제로 합니다. 기존 서버의 환경파일·서비스·DB는 먼저 확인하며 재생성하지 않습니다.

## 1. 운영 설정 확인 (최초 1회)

저장소의 배포 설정은 아래 경로와 이름을 기준으로 합니다. 실제 서버가 다르면 workflow, deploy.sh, systemd 파일을 함께 조정하세요.

| 항목 | 값 |
| --- | --- |
| 실행 및 SSH 배포 계정 | yasong-art-gallery |
| 서비스 | yasong-art-gallery.service |
| 앱 디렉토리 | /home/yasong-art-gallery |
| 비밀 설정 | /home/yasong-art-gallery/.env |
| 실행 JAR | /home/yasong-art-gallery/yasong-art-gallery.jar |
| 업로드 파일 | /home/yasong-art-gallery/uploads |
| Nginx upstream | 127.0.0.1:8080 |

unit은 FILE_UPLOAD_DIR를 위 업로드 절대 경로로 지정합니다. 서버 .env의 FILE_UPLOAD_DIR로 변경할 수 있습니다. 공개 URL은 `/uploads/...`로 동일하고 기존 파일/DB URL을 이동·수정할 필요는 없습니다. 로컬 개발 스크립트는 저장소 루트 uploads를 사용하므로 소스 디렉토리 backend와 구분합니다.

서버에는 JDK 21, Python 3, OpenSSH/SFTP, util-linux(flock), coreutils가 필요합니다. Nginx와 TLS 인증서는 실제 서비스 도메인에 맞춰 준비합니다. 저장소의 Nginx 템플릿을 그대로 덮어쓰지 말고 대조합니다. 서버에서는 npm이나 Maven 빌드를 실행하지 않습니다.

기존 `.env`에 `JWT_SECRET`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`가 있어야 합니다. 최초 설정에만 [백엔드 환경변수 예시](../../backend/.env.example)를 참고하고 비밀값은 서버에서 입력합니다. 기존 키와 환경파일은 유지합니다. 기본 upstream 포트는 8080이며, `SERVER_PORT`를 변경하면 Nginx와 배포 검사 주소도 함께 조정해야 합니다. systemd 환경파일에는 `export`를 쓰지 않고 `KEY=value` 형식을 사용합니다. 값은 로그나 Git에 출력하지 않습니다.

| 변수 | 용도·설정 기준 |
| --- | --- |
| `JWT_SECRET` | 필수 서명키. 최초 준비 시 `openssl rand -base64 64`로 생성한 값을 줄바꿈 없이 저장 |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | 실제 MySQL 접속 정보. Flyway를 실행할 계정에는 필요한 스키마 변경 권한도 부여 |
| `SERVER_PORT` | 기본 8080. 외부 HTTP/HTTPS는 Nginx의 80/443에서 처리 |
| `FILE_UPLOAD_DIR` | 업로드의 절대 경로. 기본 구성은 `/home/yasong-art-gallery/uploads` |
| `JWT_EXPIRATION` | 밀리초 단위, 기본 `86400000` |
| `GA_PROPERTY_ID`, `GA_CREDENTIALS_PATH` | 선택적 통계 설정. 자격증명 JSON은 저장소 밖에 보관 |

systemd 실행 인자는 `prod` 프로필을 명시합니다. 환경파일을 수정했다면 다음 서비스 재시작부터 반영됩니다. 로딩 문제는 unit의 `EnvironmentFile` 경로·파일 소유권·읽기 권한과 journal을 확인하고, 설정값 전체를 로그에 출력하지 않습니다.

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

CI용 SSH 키 쌍을 준비하고 공개키를 배포 계정의 `/home/yasong-art-gallery/.ssh/authorized_keys`에 등록합니다. 이미 등록한 배포 키가 있다면 재생성하지 않습니다. 개인키는 GitHub의 production environment secret `DEPLOY_SSH_KEY`에 저장합니다. 기존 개인 SSH 키를 재사용하지 않는 편이 좋습니다.

SSH 홈 디렉토리는 대상 사용자 또는 root 소유여야 하고 다른 사용자에게 쓰기 권한이 없어야 합니다. `.ssh`는 배포 계정 소유/700, `authorized_keys`는 배포 계정 소유/600으로 설정합니다. 개인키와 등록된 공개키가 같은 쌍인지 확인합니다.

sudo 권한은 관리자 계정에서 `sudo visudo -f /etc/sudoers.d/yasong-deploy`로 아래 세 명령에만 부여합니다. 서비스 계정으로 sudo가 실제 작동하는지 서버에서 검증하세요. 이 키는 앱 배포 권한을 가지므로 production secret에 접근할 수 있는 워크플로와 main 브랜치도 보호해야 합니다.

```sudoers
yasong-art-gallery ALL=(root) NOPASSWD: /usr/bin/systemctl restart yasong-art-gallery.service, /usr/bin/systemctl stop yasong-art-gallery.service, /usr/bin/systemctl is-active --quiet yasong-art-gallery.service
```

```bash
sudo visudo -c
sudo -l -U yasong-art-gallery
sudo -u yasong-art-gallery sudo -n /usr/bin/systemctl is-active --quiet yasong-art-gallery.service
```

위 `is-active` 검사는 실행 중이면 종료 코드 0, 중지 상태면 보통 3입니다. `not allowed`나 비밀번호 요구는 sudo 설정을 확인해야 합니다.

## 3. GitHub의 production 환경

Settings → Environments → production에 다음을 설정합니다.

| 종류 | 이름 | 내용 |
| --- | --- | --- |
| Secret | DEPLOY_SSH_KEY | 배포 전용 SSH 개인키 전체 |
| Secret | DEPLOY_KNOWN_HOSTS | 서버 호스트 키를 담은 known_hosts 행 |
| Variable | DEPLOY_HOST | 서버 IPv4 주소 또는 DNS 이름 |
| Variable | DEPLOY_USER | yasong-art-gallery |
| Variable | DEPLOY_PORT | SSH 포트, 생략하면 22 |

`DEPLOY_HOST`에는 `https://`, 포트, 경로 없이 공인 IP 또는 SSH 접속용 도메인만 넣습니다. SSH 개인키와 known_hosts는 **Secrets**, 호스트·사용자·포트는 **Variables**에 등록합니다.

호스트 키는 신뢰할 수 있는 서버 콘솔/관리 경로에서 fingerprint를 확인해 등록합니다. 출처를 검증하지 않은 ssh-keyscan 결과를 그대로 신뢰하면 중간자 공격을 막을 수 없습니다. 비표준 포트는 `[hostname]:port` 형식의 known_hosts 항목이 필요합니다.

DB 비밀번호와 JWT_SECRET은 서버의 기존 .env에만 두면 됩니다. CI 테스트에는 별개의 일회용 자격증명을 사용합니다. GitHub 환경의 배포 허용 브랜치는 main으로 제한하고 가능하면 필수 승인자를 설정합니다. 저장소 main도 PR 검사를 통과해야 병합되게 설정하세요.

## 4. 배포 버튼

Actions → Build and deploy → Run workflow → main 선택 → deploy 체크 → 실행합니다. 다른 브랜치에서는 빌드만 가능하고 운영 배포 job은 실행되지 않습니다. SSH가 클라우드 방화벽/보안 그룹에서 CI runner에 허용되어 있어야 합니다. 이를 위해 SSH를 전 세계에 무작정 개방하지 말고 조직의 VPN/runner 접근 정책을 사용하세요.

Actions에서 `deploy`가 Skipped이면 서버에는 배포되지 않았습니다. 성공 로그의 `Deployed release ...`와 실제 사이트 상태를 확인합니다.

빌드/테스트 성공 후 체크섬을 검증하고 새 JAR를 releases에 보관합니다. 기존 JAR가 일반 파일인 최초 전환에서도 새 JAR 설치 전에 실제 구버전을 백업합니다. 실행 경로를 새 릴리스에 대한 symlink로 원자적으로 바꾸고 재시작합니다. .env와 uploads는 릴리스 밖에 그대로 유지합니다.

정상 여부는 단순 프로세스 실행 상태가 아니라 새 JAR와 동일한 index.html 응답과 DB를 조회하는 공개 공지 API로 확인합니다. 120초 안에 정상화되지 않으면 이전 JAR로 복구하고 재시작합니다. 기존 상태가 중지였다면 실패 시 다시 중지합니다. 서버의 flock과 GitHub concurrency로 배포가 겹치지 않게 합니다.

단일 인스턴스 재시작 배포이므로 짧은 중단이 있습니다. Flyway로 적용된 DB 변경은 JAR 롤백으로 되돌리지 않습니다. 이전 코드와 호환되는 마이그레이션, 배포 전 DB 백업이 필요합니다. 배포 중 서버 종료/SSH 연결 단절 등의 경우까지 복구가 보장되는 것은 아니므로 서버 상태도 확인하세요.

```bash
sudo systemctl status yasong-art-gallery.service
sudo journalctl -u yasong-art-gallery.service -n 100 --no-pager
readlink -f /home/yasong-art-gallery/yasong-art-gallery.jar
```

releases와 incoming은 자동 삭제하지 않습니다. 현재 실행 버전과 복구에 필요한 버전을 보존한 상태에서 오래된 파일을 정리하세요. GitHub artifact 보관 기간은 14일입니다.

## HTTPS와 인증서

기존 서버는 사용 중인 도메인·Nginx 설정·인증서를 유지합니다. 신규 서버는 DNS를 연결하고 Nginx의 HTTP 설정과 `127.0.0.1:8080` 프록시를 준비한 뒤, [Certbot 공식 안내](https://certbot.eff.org/instructions)에 따라 Nginx 플러그인을 포함해 설치합니다. HTTP 인증을 사용한다면 80번 포트가 인증기관에서 접근 가능해야 합니다. 발급 전부터 존재하지 않는 인증서 경로를 Nginx에 지정하지 않습니다.

아래 도메인은 실제 서비스 도메인으로 바꿉니다. `www`도 인증서에 포함하려면 해당 DNS를 준비하고 `-d`로 추가합니다. 발급 명령은 신규 인증서가 필요한 서버에서만 실행합니다.

```bash
sudo certbot --nginx -d your-domain.example
```

설정 변경 후에는 `sudo nginx -t`가 성공한 뒤 reload합니다. 발급 및 자동 갱신 상태는 다음과 같이 점검합니다.

```bash
sudo nginx -t
sudo certbot certificates
sudo certbot renew --dry-run
systemctl list-timers --all '*certbot*'
curl -I https://your-domain.example
```

Certbot 설치 방식에 따라 갱신 작업 이름과 실행 방식이 다르므로 기존 timer 또는 스케줄을 확인합니다. 인증서 만료·DNS·HTTP 검증 실패 시 Nginx 로그와 Certbot 로그를 확인합니다. [갱신 공식 문서](https://eff-certbot.readthedocs.io/en/stable/using.html#renewing-certificates)

## 수동 복구

현재 symlink를 확인하고, releases에서 검증된 이전 JAR를 선택하여 같은 배포 스크립트로 배포할 수 있습니다. 기존 releases의 커밋 SHA 또는 커밋SHA-runID-attempt를 release ID로 사용합니다. 자동 복구 실패, unit 변경, .env 변경은 관리자 확인이 필요하며, JAR 복구가 설정이나 DB를 되돌리지는 않습니다.
