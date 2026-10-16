# Google Analytics 설정 가이드

Google Analytics API를 사용하여 웹사이트 통계를 가져오려면 다음 단계를 따라주세요.

## 1. Google Cloud Console 설정

### 1-1. 프로젝트 생성 및 API 활성화
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 프로젝트 생성 (없는 경우)
3. "API 및 서비스" > "라이브러리"로 이동
4. **"Google Analytics Data API"** 검색 후 활성화

### 1-2. 서비스 계정 생성
1. "API 및 서비스" > "사용자 인증 정보"로 이동
2. "사용자 인증 정보 만들기" > "서비스 계정" 선택
3. 서비스 계정 이름 입력 (예: yasongmuseum-analytics)
4. "완료" 클릭
5. 생성된 서비스 계정 클릭 > "키" 탭 > "키 추가" > "새 키 만들기"
6. **JSON** 형식 선택 후 다운로드
7. 다운로드된 JSON 파일을 안전한 위치에 저장

## 2. Google Analytics 설정

### 2-1. Property ID 확인
1. [Google Analytics](https://analytics.google.com/)에 접속
2. 관리 (톱니바퀴 아이콘) 클릭
3. "속성" > "속성 세부정보" 선택
4. **속성 ID** 복사 (숫자만, 예: 123456789)

### 2-2. 서비스 계정에 권한 부여
1. Google Analytics 관리 페이지에서 "속성 액세스 관리" 선택
2. 우측 상단 "+" 버튼 클릭
3. **서비스 계정 이메일** 입력 (JSON 파일에 있는 `client_email`)
   - 예: yasongmuseum-analytics@project-id.iam.gserviceaccount.com
4. 역할: **뷰어(Viewer)** 또는 **분석가(Analyst)** 선택
5. "추가" 클릭

## 3. 서버 설정

### 3-1. 서비스 계정 JSON 파일 배치
다운로드한 JSON 파일을 서버에 배치합니다.

**권장 위치: 애플리케이션 홈 디렉토리** (systemd 실행 유저의 홈)

```bash
# 옵션 1: 애플리케이션 디렉토리에 배치 (권장)
mkdir -p /home/yasong-art-gallery/.credentials
mv ~/downloaded-key.json /home/yasong-art-gallery/.credentials/ga-service-account.json
chmod 600 /home/yasong-art-gallery/.credentials/ga-service-account.json
chown yasong-art-gallery:yasong-art-gallery /home/yasong-art-gallery/.credentials/ga-service-account.json
```

또는 시스템 설정 디렉토리에 배치:

```bash
# 옵션 2: 시스템 설정 디렉토리에 배치
sudo mkdir -p /etc/yasong-art-gallery
sudo mv ~/downloaded-key.json /etc/yasong-art-gallery/ga-service-account.json
sudo chmod 600 /etc/yasong-art-gallery/ga-service-account.json
sudo chown yasong-art-gallery:yasong-art-gallery /etc/yasong-art-gallery/ga-service-account.json
```

**중요:** 
- 파일 이름은 자유롭게 변경 가능합니다
- 위치는 애플리케이션이 읽을 수 있는 곳이면 어디든 가능합니다
- **파일 권한을 600으로 설정**하여 소유자만 읽을 수 있도록 해야 합니다

### 3-2. 환경 변수 설정
`.env` 파일에 다음 설정 추가:

```bash
# Google Analytics 설정
GA_PROPERTY_ID=123456789

# 옵션 1: 애플리케이션 디렉토리 사용 (권장)
GA_CREDENTIALS_PATH=/home/yasong-art-gallery/.credentials/ga-service-account.json

# 또는 옵션 2: 시스템 설정 디렉토리 사용
# GA_CREDENTIALS_PATH=/etc/yasong-art-gallery/ga-service-account.json
```

또는 systemd 서비스 파일에 직접 설정:

```ini
# /etc/systemd/system/yasong-art-gallery.service
[Service]
Environment="GA_PROPERTY_ID=123456789"
Environment="GA_CREDENTIALS_PATH=/home/yasong-art-gallery/.credentials/ga-service-account.json"
```

## 4. API 사용법

### 4-1. API 엔드포인트

**전체 통계 조회** (관리자 전용)
```http
GET /api/admin/analytics?days=30
Authorization: Bearer {JWT_TOKEN}
```

**요약 정보 조회** (최근 7일)
```http
GET /api/admin/analytics/summary
Authorization: Bearer {JWT_TOKEN}
```

### 4-2. 응답 예시

```json
{
  "overview": {
    "totalUsers": 1234,
    "newUsers": 567,
    "sessions": 2345,
    "pageViews": 5678,
    "averageSessionDuration": 123.45,
    "bounceRate": 45.67,
    "engagementRate": 54.33
  },
  "topPages": [
    {
      "pagePath": "/",
      "pageTitle": "홈",
      "views": 1234,
      "uniquePageViews": 890,
      "averageTimeOnPage": 45.6
    }
  ],
  "trafficSources": [
    {
      "source": "google",
      "medium": "organic",
      "users": 567,
      "sessions": 789,
      "percentage": 45.9
    }
  ],
  "deviceBreakdown": [
    {
      "deviceCategory": "mobile",
      "users": 678,
      "sessions": 890,
      "percentage": 54.9
    }
  ],
  "dailyMetrics": [
    {
      "date": "2026-01-29",
      "users": 123,
      "sessions": 234,
      "pageViews": 456
    }
  ],
  "locationBreakdown": [
    {
      "country": "South Korea",
      "region": "Seoul",
      "city": "Seoul",
      "users": 456,
      "sessions": 678,
      "pageViews": 1234,
      "percentage": 37.0
    }
  ]
}
```

## 5. 테스트

```bash
# 의존성 다운로드 및 빌드
mvn clean package

# 애플리케이션 실행
java -jar target/yasong-art-gallery.jar --spring.profiles.active=prod

# API 테스트 (관리자 로그인 후)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/admin/analytics?days=7
```

## 6. 보안 주의사항

1. **서비스 계정 JSON 파일은 절대 Git에 커밋하지 마세요!**
2. 파일 권한을 600으로 제한하세요
3. 환경 변수로 민감한 정보 관리
4. API는 ADMIN 권한 사용자만 접근 가능

## 7. 문제 해결

### 에러: "Permission denied"
- 서비스 계정이 Google Analytics에 추가되었는지 확인
- 권한이 최소 "뷰어" 이상인지 확인

### 에러: "Property not found"
- Property ID가 올바른지 확인
- GA4 속성인지 확인 (Universal Analytics는 지원 종료)

### 에러: "Credentials not found"
- JSON 파일 경로가 올바른지 확인
- 파일 읽기 권한 확인

## 8. 참고 자료

- [Google Analytics Data API 문서](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [서비스 계정 설정 가이드](https://cloud.google.com/iam/docs/service-accounts)
- [GA4 Property ID 찾기](https://support.google.com/analytics/answer/9539598)
