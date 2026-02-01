#!/bin/bash

# 2GB Swap 파일 생성 스크립트
# Oracle Cloud Free Tier 1GB 메모리 서버용

echo "=== Swap 파일 생성 시작 ==="

# 1. 기존 swap 확인
echo "현재 swap 상태:"
free -h

# 2. 2GB swap 파일 생성
echo -e "\n2GB swap 파일 생성 중..."
sudo fallocate -l 2G /swapfile

# 3. 권한 설정
echo "권한 설정..."
sudo chmod 600 /swapfile

# 4. swap 영역으로 설정
echo "swap 영역 설정..."
sudo mkswap /swapfile

# 5. swap 활성화
echo "swap 활성화..."
sudo swapon /swapfile

# 6. 부팅 시 자동 마운트 설정
echo "부팅 시 자동 마운트 설정..."
if ! grep -q '/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# 7. Swappiness 설정 (메모리를 더 많이 사용하도록)
echo "Swappiness 설정 (10으로 낮춤)..."
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf

# 8. 결과 확인
echo -e "\n=== Swap 설정 완료 ==="
free -h
echo -e "\nSwap 정보:"
swapon --show

echo -e "\n✅ 2GB Swap 파일 생성 및 활성화 완료!"
echo "메모리 부족 시 자동으로 Swap 영역 사용됩니다."
