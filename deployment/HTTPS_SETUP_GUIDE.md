# HTTPS 설정 가이드 (Nginx + Let's Encrypt)

## 📋 Prerequisites

### 1. 도메인 필요
- 도메인을 구매했거나 소유하고 있어야 함
- DNS A 레코드가 서버 IP를 가리켜야 함

```bash
# DNS 설정 확인
nslookup yasongmuseum.com
dig yasongmuseum.com

# 결과가 서버 IP와 일치해야 함
```

### 2. 방화벽 포트 오픈
```bash
# 80 (HTTP), 443 (HTTPS) 포트 열기
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### 3. 서버 요구사항
- Ubuntu 20.04+ / Debian 10+
- 최소 1GB RAM
- Root 또는 sudo 권한

---

## 🚀 Quick Start (자동 설정)

### 1. 스크립트 실행
```bash
cd /home/yasongmuseum/deployment
sudo bash setup-ssl.sh yasongmuseum.com
```

### 2. 입력 정보
- 도메인 이름
- www 서브도메인 추가 여부 (권장: y)
- 이메일 주소 (인증서 만료 알림용)

### 3. 완료
- 약 5-10분 소요
- 자동으로 Nginx 설치, 설정, SSL 인증서 발급

---

## 🔧 Manual Setup (단계별 설정)

### Step 1: Nginx 설치
```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Step 2: Certbot 설치
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Step 3: Nginx 설정 파일 배포
```bash
# 설정 파일 복사
sudo cp /home/yasongmuseum/deployment/nginx/yasongmuseum.conf \
     /etc/nginx/sites-available/yasongmuseum

# 도메인 수정 (your-domain.com으로 변경)
sudo sed -i 's/yasongmuseum.com/your-domain.com/g' \
     /etc/nginx/sites-available/yasongmuseum

# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/yasongmuseum \
        /etc/nginx/sites-enabled/

# 기본 사이트 비활성화
sudo rm /etc/nginx/sites-enabled/default

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl reload nginx
```

### Step 4: SSL 인증서 발급
```bash
sudo certbot --nginx \
  -d yasongmuseum.com \
  -d www.yasongmuseum.com \
  --email your-email@example.com \
  --agree-tos \
  --redirect
```

### Step 5: 자동 갱신 설정 확인
```bash
# 자동 갱신 테스트
sudo certbot renew --dry-run

# Systemd 타이머 확인
sudo systemctl status certbot.timer

# 다음 갱신 일정 확인
sudo certbot certificates
```

---

## 📊 Nginx 설정 구조

### Reverse Proxy 흐름
```
Client (HTTPS:443)
    ↓
Nginx (SSL Termination)
    ↓ [캐싱, 압축, 헤더 추가]
Spring Boot (HTTP:8080)
```

### Location 우선순위
1. **정적 파일** (`/static/`, `.js`, `.css`, 이미지) → 1일 캐시
2. **업로드 파일** (`/uploads/`) → 1시간 캐시
3. **API** (`/api/`) → 프록시, 캐시 없음
4. **React SPA** (`/`) → 프록시 + fallback to index.html

### 성능 최적화
- Gzip 압축 활성화
- HTTP/2 지원
- 정적 파일 캐싱
- Connection keep-alive

---

## 🔐 보안 설정 설명

### SSL/TLS 설정
```nginx
# 최신 TLS 버전만 허용
ssl_protocols TLSv1.2 TLSv1.3;

# 강력한 암호화 알고리즘
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:...';

# OCSP Stapling (인증서 검증 성능 향상)
ssl_stapling on;
ssl_stapling_verify on;
```

### 보안 헤더
```nginx
# HSTS: 브라우저가 항상 HTTPS 사용
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

# Clickjacking 방어
X-Frame-Options: SAMEORIGIN

# MIME 타입 스니핑 방지
X-Content-Type-Options: nosniff

# XSS 필터 활성화
X-XSS-Protection: 1; mode=block
```

### SSL Labs 테스트 결과
설정 후 다음 사이트에서 A+ 등급 확인:
https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com

---

## 🔄 인증서 관리

### 갱신 주기
- Let's Encrypt 인증서: 90일 유효
- Certbot이 자동으로 30일 전에 갱신
- Systemd 타이머가 하루 2번 체크

### 수동 갱신
```bash
# 모든 인증서 갱신
sudo certbot renew

# 특정 도메인만 갱신
sudo certbot renew --cert-name yasongmuseum.com

# 갱신 후 Nginx 재시작
sudo systemctl reload nginx
```

### 인증서 정보 확인
```bash
# 인증서 목록 및 만료일
sudo certbot certificates

# 상세 정보
sudo openssl x509 -in /etc/letsencrypt/live/yasongmuseum.com/fullchain.pem -text -noout
```

### 인증서 삭제
```bash
sudo certbot delete --cert-name yasongmuseum.com
```

---

## 🧪 테스트

### 1. HTTPS 접속 확인
```bash
# HTTP → HTTPS 리다이렉트 확인
curl -I http://yasongmuseum.com
# 결과: HTTP/1.1 301 Moved Permanently
# Location: https://yasongmuseum.com/

# HTTPS 응답 확인
curl -I https://yasongmuseum.com
# 결과: HTTP/2 200
```

### 2. SSL 인증서 확인
```bash
# 인증서 체인 확인
openssl s_client -connect yasongmuseum.com:443 -servername yasongmuseum.com

# 만료일 확인
echo | openssl s_client -connect yasongmuseum.com:443 2>/dev/null | \
  openssl x509 -noout -dates
```

### 3. 보안 헤더 확인
```bash
curl -I https://yasongmuseum.com | grep -i "strict-transport\|x-frame\|x-content"
```

### 4. 프록시 동작 확인
```bash
# API 요청
curl https://yasongmuseum.com/api/website/settings

# 정적 파일
curl -I https://yasongmuseum.com/static/css/main.css

# React SPA (client-side routing)
curl -I https://yasongmuseum.com/collections/123
```

---

## 🚨 Troubleshooting

### 문제 1: DNS가 서버를 가리키지 않음
```bash
# 증상: Let's Encrypt 인증서 발급 실패
# 해결:
nslookup yasongmuseum.com
# IP가 서버 IP와 일치하는지 확인
# DNS 전파는 최대 24-48시간 소요
```

### 문제 2: 방화벽이 포트 차단
```bash
# 증상: Connection timeout
# 해결:
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 문제 3: Nginx 설정 오류
```bash
# 증상: nginx -t 실패
# 해결:
sudo nginx -t
# 오류 메시지 확인 후 설정 수정

# 로그 확인
sudo tail -f /var/log/nginx/error.log
```

### 문제 4: Spring Boot가 시작되지 않음
```bash
# 증상: 502 Bad Gateway
# 해결:
sudo systemctl status yasongmuseum
sudo journalctl -u yasongmuseum -n 50

# Spring Boot가 8080 포트에서 실행 중인지 확인
sudo netstat -tlnp | grep 8080
```

### 문제 5: 인증서 갱신 실패
```bash
# 증상: certbot renew 실패
# 해결:
# 1. Nginx가 80번 포트를 듣고 있는지 확인
sudo netstat -tlnp | grep :80

# 2. Let's Encrypt rate limit 확인
# (같은 도메인 주당 5회 제한)

# 3. 수동 갱신 시도
sudo certbot renew --force-renewal --dry-run
```

---

## 📊 모니터링

### Nginx 로그 확인
```bash
# Access Log (성공한 요청)
sudo tail -f /var/log/nginx/yasongmuseum_access.log

# Error Log (오류)
sudo tail -f /var/log/nginx/yasongmuseum_error.log

# 특정 IP 필터링
sudo grep "1.2.3.4" /var/log/nginx/yasongmuseum_access.log
```

### SSL 인증서 만료 알림
```bash
# Cron으로 만료 30일 전 알림
# /etc/cron.daily/check-ssl-expiry

#!/bin/bash
DOMAIN="yasongmuseum.com"
DAYS_LEFT=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | \
  openssl x509 -noout -checkend $((30*86400)))

if [ $? -eq 1 ]; then
    echo "SSL certificate for $DOMAIN expires in less than 30 days!" | \
      mail -s "SSL Certificate Expiry Warning" admin@example.com
fi
```

---

## 🎯 Best Practices

### 1. 정기 점검 (월 1회)
```bash
# SSL 등급 확인
# https://www.ssllabs.com/ssltest/

# 인증서 만료일 확인
sudo certbot certificates

# Nginx 로그 용량 확인
du -sh /var/log/nginx/
```

### 2. 로그 로테이션
```bash
# /etc/logrotate.d/nginx (이미 설정됨)
/var/log/nginx/*.log {
    daily
    rotate 14
    compress
    delaycompress
}
```

### 3. Rate Limiting (DDoS 방어)
```nginx
# /etc/nginx/nginx.conf에 추가
http {
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    
    server {
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            # ... existing config
        }
    }
}
```

---

## 📚 참고 자료

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Nginx Reverse Proxy Guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [SSL Labs Best Practices](https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices)
