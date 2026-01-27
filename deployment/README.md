# Yasongmuseum 배포 가이드 (Systemd)

## 1. 서버 초기 설정 (최초 1회)

### 필수 요구사항
- Linux 서버 (Ubuntu 20.04+, CentOS 7+, etc.)
- Java 21 설치
- MySQL 8.0+ 설치
- sudo 권한

### 초기 설정 실행
```bash
# 배포 파일 업로드
scp -r deployment root@서버주소:/tmp/

# 서버에서 초기 설정 실행
ssh root@서버주소
cd /tmp/deployment
chmod +x setup.sh
./setup.sh
```

## 2. 배포하기

### 로컬에서 빌드
```bash
./mvnw clean package -DskipTests
```

### JAR 파일 업로드
```bash
scp target/yasongmuseum-0.0.1-SNAPSHOT.jar yasongmuseum@서버주소:/home/yasongmuseum/
```

### 배포 스크립트 실행
```bash
ssh yasongmuseum@서버주소
cd /home/yasongmuseum
./deployment/deploy.sh
```

## 3. 관리 명령어

### 서비스 제어
```bash
# 시작
sudo systemctl start yasongmuseum

# 중지
sudo systemctl stop yasongmuseum
# 또는
./deployment/stop.sh

# 재시작
sudo systemctl restart yasongmuseum

# 상태 확인
sudo systemctl status yasongmuseum
# 또는
./deployment/status.sh
```

### 로그 확인
```bash
# 실시간 로그 (Ctrl+C로 종료)
sudo journalctl -u yasongmuseum -f

# 최근 100줄
sudo journalctl -u yasongmuseum -n 100

# 오늘 로그만
sudo journalctl -u yasongmuseum --since today

# 특정 시간 이후
sudo journalctl -u yasongmuseum --since "2026-01-27 14:00:00"

# 에러만 필터링
sudo journalctl -u yasongmuseum -p err

# 로그 검색
sudo journalctl -u yasongmuseum | grep "ERROR"
```

### 자동 시작 설정
```bash
# 부팅 시 자동 시작 활성화
sudo systemctl enable yasongmuseum

# 자동 시작 비활성화
sudo systemctl disable yasongmuseum

# 자동 시작 상태 확인
sudo systemctl is-enabled yasongmuseum
```

## 4. 문제 해결

### 서비스가 시작되지 않을 때
```bash
# 상세 로그 확인
sudo journalctl -u yasongmuseum -n 50 --no-pager

# 서비스 상태 확인
sudo systemctl status yasongmuseum

# 설정 파일 확인
sudo systemctl cat yasongmuseum
```

### 포트가 이미 사용 중일 때
```bash
# 8080 포트 사용 중인 프로세스 찾기
sudo lsof -i :8080

# 프로세스 종료
sudo kill -9 <PID>
```

### 데이터베이스 연결 실패
```bash
# MySQL 서비스 상태 확인
sudo systemctl status mysql

# application-prod.properties 확인
cat /home/yasongmuseum/application-prod.properties
```

## 5. 업데이트 배포

### 무중단 업데이트
```bash
# 1. 새 버전 빌드
./mvnw clean package -DskipTests

# 2. JAR 파일 업로드
scp target/yasongmuseum-0.0.1-SNAPSHOT.jar yasongmuseum@서버주소:/home/yasongmuseum/

# 3. 배포 (자동으로 백업 → 재시작)
ssh yasongmuseum@서버주소
./deployment/deploy.sh
```

### 롤백 (이전 버전으로 복구)
```bash
# 백업 목록 확인
ls -lh /home/yasongmuseum/backups/

# 백업 파일 복원
cp /home/yasongmuseum/backups/yasongmuseum-0.0.1-SNAPSHOT.jar.20260127_150000 \
   /home/yasongmuseum/yasongmuseum-0.0.1-SNAPSHOT.jar

# 재시작
sudo systemctl restart yasongmuseum
```

## 6. 모니터링

### CPU/메모리 사용량
```bash
# 프로세스 리소스 확인
ps aux | grep yasongmuseum

# systemd cgroup 정보
sudo systemd-cgtop yasongmuseum.service
```

### 디스크 사용량
```bash
# 로그 크기 확인
sudo journalctl --disk-usage

# uploads 폴더 크기
du -sh /home/yasongmuseum/uploads
```

## 7. 보안 설정

### 방화벽
```bash
# UFW (Ubuntu)
sudo ufw allow 8080/tcp
sudo ufw status

# firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### HTTPS 설정 (선택)
```bash
# Certbot으로 Let's Encrypt 인증서 발급
sudo apt install certbot
sudo certbot certonly --standalone -d 도메인주소
```

## 8. Systemd의 장점

✅ **자동 재시작**: 크래시 시 자동으로 재시작
✅ **부팅 시 자동 시작**: 서버 재부팅 시 자동으로 시작
✅ **로그 관리**: journalctl로 중앙 집중식 로그 관리
✅ **리소스 제한**: CPU/메모리 제한 가능
✅ **보안**: 권한 분리, 격리
✅ **표준화**: 모든 Linux 배포판에서 동일한 방식

## 9. 운영 체크리스트

배포 전:
- [ ] application-prod.properties에서 DB 설정 확인
- [ ] JWT secret 변경 확인
- [ ] 로그 디렉토리 권한 확인
- [ ] 방화벽 포트 오픈 확인

배포 후:
- [ ] 서비스 상태 확인 (`systemctl status`)
- [ ] 로그에 에러 없는지 확인 (`journalctl -u yasongmuseum`)
- [ ] 웹사이트 접속 확인 (`curl http://localhost:8080`)
- [ ] API 테스트 (`curl http://localhost:8080/api/notices`)

정기 점검:
- [ ] 디스크 사용량 확인 (매주)
- [ ] 로그 확인 (매일)
- [ ] 백업 확인 (매일)
- [ ] 업데이트 체크 (매월)
