# 프로덕션 배포 가이드

## 🚀 배포 전 체크리스트

### 1. 환경 변수 설정
```bash
# .env.production 파일 생성 및 설정
VITE_API_BASE_URL=https://your-api-domain.com
VITE_NAVER_MAP_CLIENT_ID=your_production_client_id
```

### 2. 네이버 지도 API 설정
1. [Naver Cloud Platform](https://www.ncloud.com/product/applicationService/maps) 접속
2. 프로덕션 도메인을 허용 도메인에 등록
   - 예: `https://yasongmuseum.kr`, `https://www.yasongmuseum.kr`
3. 프로덕션용 Client ID 발급 또는 도메인 추가

### 3. 빌드 및 배포

```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# dist 폴더가 생성됨 - 이 폴더를 웹 서버에 배포
```

### 4. 웹 서버 설정 (Nginx 예시)

```nginx
server {
    listen 80;
    server_name yasongmuseum.kr www.yasongmuseum.kr;

    root /var/www/yasongmuseum/dist;
    index index.html;

    # SPA를 위한 라우팅 설정
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 파일 캐싱
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## 🔒 보안 체크리스트

### 완료된 항목
- ✅ console.log를 개발 환경에서만 출력하도록 수정
- ✅ .gitignore에 환경 변수 파일 추가
- ✅ API 에러 메시지를 프로덕션에서 숨김
- ✅ 민감한 데이터 로그 제거 (비밀번호 등)

### 추가 확인 필요
- ⚠️ **네이버 지도 API 키**: 현재 `w4ibj79d4r`가 `index.html`에 하드코딩되어 있음
  - 프로덕션 배포 시 도메인 제한 설정 필수
  - 또는 환경 변수로 관리하도록 변경 권장

- ⚠️ **HTTPS 적용**: 프로덕션에서는 반드시 HTTPS 사용
  - Let's Encrypt 무료 SSL 인증서 활용 가능

- ⚠️ **CORS 설정**: 백엔드 API에서 프로덕션 도메인 허용 확인
  ```java
  // Spring Boot CORS 설정 예시
  @CrossOrigin(origins = {"https://yasongmuseum.kr", "https://www.yasongmuseum.kr"})
  ```

- ⚠️ **API Rate Limiting**: 백엔드에서 API 호출 제한 설정 권장

## 📊 성능 최적화

### 이미지 최적화
현재 이미지는 서버에서 관리되므로 백엔드에서 다음을 구현하는 것이 좋습니다:
- WebP 포맷 지원
- 이미지 리사이징 (다양한 해상도)
- CDN 활용

### 번들 크기 최적화
```bash
# 번들 분석
npm install -D vite-plugin-visualizer
```

vite.config.ts에 추가:
```typescript
import { visualizer } from 'vite-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        }
      }
    }
  }
});
```

## 🐛 모니터링

### 에러 추적
프로덕션 환경에서 에러 모니터링을 위해 다음 중 하나를 추천:
- [Sentry](https://sentry.io/)
- [LogRocket](https://logrocket.com/)
- [Google Analytics](https://analytics.google.com/)

## 📝 백엔드 API 요구사항

프론트엔드가 제대로 작동하려면 백엔드에서 다음을 제공해야 합니다:

1. **CORS 설정**: 프로덕션 도메인 허용
2. **JWT 인증**: `/api/auth/login`, `/api/auth/signup`
3. **파일 업로드**: 이미지 업로드 API
4. **API 엔드포인트**:
   - 공지사항: `/api/notices`
   - 전시: `/api/exhibitions`
   - 소장품: `/api/collections`
   - 기념품: `/api/souvenirs`
   - 관리: `/api/management/*`
   - 사용자: `/api/users`

## 🔧 트러블슈팅

### 빌드 오류
```bash
# 캐시 삭제 후 재빌드
rm -rf node_modules dist
npm install
npm run build
```

### 라우팅 404 오류
- Nginx/Apache에서 SPA 라우팅 설정 확인
- `try_files $uri $uri/ /index.html` 설정 필요

### API 연결 오류
1. `.env.production`의 `VITE_API_BASE_URL` 확인
2. 백엔드 CORS 설정 확인
3. 네트워크 탭에서 실제 요청 URL 확인

## 📞 배포 후 확인사항

- [ ] 모든 페이지가 정상 로드되는지 확인
- [ ] 로그인/회원가입 기능 테스트
- [ ] 이미지 로딩 확인
- [ ] 네이버 지도 정상 작동 확인
- [ ] 모바일 반응형 확인
- [ ] 관리자 페이지 접근 권한 확인
- [ ] 파일 업로드 기능 테스트
