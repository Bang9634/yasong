// API Base URL 설정 (개발: http://localhost:8080, 프로덕션: 빈 값)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface ApiCallOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * API 호출 헬퍼 함수
 */
const apiCall = async (endpoint: string, options: ApiCallOptions = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  if (import.meta.env.DEV) {
    console.log("API call:"+url);
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
      const error = await response.json().catch(() => ({
        message: 'An error occurred'
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

/**
 * 인증 API
 */
export const authAPI = {
  /**
   * 회원가입
   * POST /api/auth/signup
   */
  signup: async (email: string, username: string, password: string, name: string) => {
    return apiCall('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, name })
    });
  },

  /**
   * 로그인
   * POST /api/auth/login
   */
  login: async (username: string, password: string) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({username, password})
    });
  },

  /**
   * 테스트 API
   * GET /api/auth/test
   */
  test: async () => {
    return apiCall('/api/auth/test', {
      method: 'GET'
    });
  }
};

export const usersAPI = {

  /**
   * 로그인된 사용자 정보 요청
   * GET /api/users/me
   */
  me: async () => {
    return apiCall('/api/users/me', {
      method: 'GET'
    });
  },

  /**
   * 프로필 업데이트
   * PUT /api/users/me
   */
  updateProfile: async (profileData: { name: string; email: string }) => {
    return apiCall('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  /**
   * 비밀번호 변경
   * PUT /api/users/me/password
   */
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    return apiCall('/api/users/me/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  },

  /**
   * 계정 삭제
   * DELETE /api/users/me
   */
  deleteAccount: async (password: string) => {
    return apiCall('/api/users/me', {
      method: 'DELETE',
      body: JSON.stringify({ password })
    });
  },
}

/**
 * 인증이 필요한 API 예시 (나중에 사용)
 */
export const artworkAPI = {
  /**
   * 작품 목록 조회
   * GET /api/artworks
   */
  getArtworks: async () => {
    return apiCall('/api/artworks', {
      method: 'GET'
    });
  },

  /**
   * 작품 생성
   * POST /api/artworks
   */
  createArtwork: async (artworkData: any) => {
    return apiCall('/api/artworks', {
      method: 'POST',
      body: JSON.stringify(artworkData)
    });
  }
};

export default apiCall;