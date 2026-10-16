// API Base URL 설정 (개발: http://localhost:8080, 프로덕션: 빈 값)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface ApiCallOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * 이미지 URL을 완전한 URL로 변환
 * 상대 경로인 경우 API_BASE_URL을 붙여줌
 */
export const getFullImageUrl = (url: string): string => {
  if (!url) return '';
  // 이미 완전한 URL인 경우 (http:// 또는 https://로 시작)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // 상대 경로인 경우 API_BASE_URL을 붙임
  return `${API_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
};

/**
 * API 호출 헬퍼 함수
 */
export const apiCall = async (endpoint: string, options: ApiCallOptions = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  // 개발 환경에서만 로그 출력
  if (import.meta.env.DEV) {
    console.log("[API]", url);
  }

  
  // 기본 헤더 설정
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 토큰이 있으면 Authorization 헤더 추가
  const token = localStorage.getItem('token');
  if (token) { 
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 에러 응답 처리
    if (!response.ok) {
      // 401 Unauthorized - 토큰 만료 또는 인증 실패
      if (response.status === 401) {
        // 로그인 API 호출이 아닌 경우에만 자동 로그아웃
        if (!endpoint.includes('/auth/login')) {
          // 토큰과 사용자 정보 삭제
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // 로그인 페이지로 리다이렉트
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
          
          throw new Error('로그인 세션이 만료되었습니다.');
        }
      }
      
      const contentType = response.headers.get('content-type');
      let error;
      
      if (contentType && contentType.includes('application/json')) {
        error = await response.json().catch(() => ({
          message: 'An error occurred'
        }));
      } else {
        const text = await response.text();
        error = { message: text || `HTTP error! status: ${response.status}` };
      }
      
      // 개발 환경에서만 상세 에러 로그
      if (import.meta.env.DEV) {
        console.error('[API Error]', {
          url,
          status: response.status,
          statusText: response.statusText,
          error
        });
      }
      
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    // 개발 환경에서만 상세 에러 로그
    if (import.meta.env.DEV) {
      console.error('API call failed:', error);
    }
    throw error;
  }
};

export default apiCall;
