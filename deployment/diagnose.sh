#!/bin/bash
# 배포 문제 진단 스크립트

echo "=================================="
echo "YaSong Art Gallery 진단"
echo "=================================="

echo ""
echo "1️⃣ Nginx 상태:"
sudo systemctl status nginx --no-pager | head -20

echo ""
echo "2️⃣ 애플리케이션 상태:"
sudo systemctl status yasong-art-gallery --no-pager | head -20

echo ""
echo "3️⃣ 포트 리스닝 확인:"
echo "   - 80번 포트 (Nginx):"
sudo netstat -tlnp | grep :80 || echo "   ❌ 80번 포트 리스닝 안 함"
echo "   - 8080번 포트 (Spring Boot):"
sudo netstat -tlnp | grep :8080 || echo "   ❌ 8080번 포트 리스닝 안 함"

echo ""
echo "4️⃣ 방화벽 상태:"
sudo ufw status | head -20

echo ""
echo "5️⃣ Nginx 설정 테스트:"
sudo nginx -t

echo ""
echo "6️⃣ Nginx 에러 로그 (최근 20줄):"
sudo tail -20 /var/log/nginx/error.log

echo ""
echo "7️⃣ 애플리케이션 로그 (최근 20줄):"
sudo journalctl -u yasong-art-gallery -n 20 --no-pager

echo ""
echo "8️⃣ 로컬 접속 테스트:"
echo "   - Spring Boot (8080):"
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:8080 || echo "   ❌ 접속 실패"
echo "   - Nginx (80):"
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:80 || echo "   ❌ 접속 실패"

echo ""
echo "=================================="
echo "진단 완료"
echo "=================================="
