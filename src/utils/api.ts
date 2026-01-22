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
 * 관리자 - 사용자 관리 API (ADMIN 전용)
 */
export const adminUsersAPI = {
  /**
   * 전체 사용자 목록 조회
   * GET /api/admin/users
   */
  getAllUsers: async () => {
    return apiCall('/api/admin/users', {
      method: 'GET'
    });
  },

  /**
   * 특정 사용자 정보 조회
   * GET /api/admin/users/{userId}
   */
  getUserById: async (id: number) => {
    return apiCall(`/api/admin/users/${id}`, {
      method: 'GET'
    });
  },

  /**
   * 사용자 권한 변경
   * PUT /api/admin/users/{userId}/role
   */
  updateUserRole: async (id: number, role: string) => {
    return apiCall(`/api/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  },

  /**
   * 사용자 삭제
   * DELETE /api/admin/users/{userId}
   */
  deleteUser: async (id: number) => {
    return apiCall(`/api/admin/users/${id}`, {
      method: 'DELETE'
    });
  },
};

/**
 * 공지사항 API
 */
export const noticeAPI = {
  /**
   * 공지사항 목록 조회 (공개된 것만)
   * GET /api/notices
   */
  getNotices: async () => {
    return apiCall('/api/notices', {
      method: 'GET'
    });
  },

  /**
   * 공지사항 상세 조회
   * GET /api/notices/{noticeId}
   */
  getNoticeById: async (noticeId: string) => {
    return apiCall(`/api/notices/${noticeId}`, {
      method: 'GET'
    });
  },

  /**
   * 관리자 - 전체 공지사항 목록 조회
   * GET /api/management/notices
   */
  getAllNotices: async () => {
    return apiCall('/api/management/notices', {
      method: 'GET'
    });
  },

  /**
   * 관리자 - 공지사항 생성
   * POST /api/management/notices
   */
  createNotice: async (noticeData: {
    title: string;
    content: string;
    category: string;
    isPinned?: boolean;
    status?: string;
  }) => {
    return apiCall('/api/management/notices', {
      method: 'POST',
      body: JSON.stringify(noticeData)
    });
  },

  /**
   * 관리자 - 공지사항 수정
   * PUT /api/management/notices/{noticeId}
   */
  updateNotice: async (noticeId: string, noticeData: {
    title: string;
    content: string;
    category: string;
    isPinned?: boolean;
    status?: string;
  }) => {
    return apiCall(`/api/management/notices/${noticeId}`, {
      method: 'PUT',
      body: JSON.stringify(noticeData)
    });
  },

  /**
   * 관리자 - 공지사항 삭제
   * DELETE /api/management/notices/{noticeId}
   */
  deleteNotice: async (noticeId: string) => {
    return apiCall(`/api/management/notices/${noticeId}`, {
      method: 'DELETE'
    });
  },
};

/**
 * 홈페이지 관리 API (ADMIN, MANAGER)
 */
export const websiteAPI = {
  /**
   * 홈페이지 설정 조회
   * GET /api/website/settings
   */
  getSettings: async () => {
    return apiCall('/api/website/settings', {
      method: 'GET'
    });
  },

  /**
   * 배경 이미지 업데이트
   * PUT /api/website/background
   */
  updateBackground: async (backgroundData: any) => {
    return apiCall('/api/website/background', {
      method: 'PUT',
      body: JSON.stringify(backgroundData)
    });
  },

  /**
   * 텍스트 데이터 업데이트
   * PUT /api/website/text
   */
  updateText: async (textData: any) => {
    return apiCall('/api/website/text', {
      method: 'PUT',
      body: JSON.stringify(textData)
    });
  },

  /**
   * 기념품 목록 조회
   * GET /api/website/souvenirs
   */
  getSouvenirs: async () => {
    return apiCall('/api/website/souvenirs', {
      method: 'GET'
    });
  },

  /**
   * 기념품 추가
   * POST /api/website/souvenirs
   */
  createSouvenir: async (souvenirData: any) => {
    return apiCall('/api/website/souvenirs', {
      method: 'POST',
      body: JSON.stringify(souvenirData)
    });
  },

  /**
   * 기념품 수정
   * PUT /api/website/souvenirs/{souvenirId}
   */
  updateSouvenir: async (souvenirId: string, souvenirData: any) => {
    return apiCall(`/api/website/souvenirs/${souvenirId}`, {
      method: 'PUT',
      body: JSON.stringify(souvenirData)
    });
  },

  /**
   * 기념품 삭제
   * DELETE /api/website/souvenirs/{souvenirId}
   */
  deleteSouvenir: async (souvenirId: string) => {
    return apiCall(`/api/website/souvenirs/${souvenirId}`, {
      method: 'DELETE'
    });
  },
};

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