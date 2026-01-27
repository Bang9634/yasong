// API Base URL 설정 (개발: http://localhost:8080, 프로덕션: 빈 값)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
const apiCall = async (endpoint: string, options: ApiCallOptions = {}): Promise<any> => {
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
    // 개발 환경에서만 상세 에러 로그
    if (import.meta.env.DEV) {
      console.error('API call failed:', error);
    }
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
  getVisibleNotices: async () => {
    return apiCall('/api/notices', {
      method: 'GET'
    });
  },

  /**
   * 공지사항 상세 조회
   * GET /api/notices/{noticeId}
   */
  getVisibleNoticeById: async (noticeId: string) => {
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
   * 관리자 - 공지사항 상세 조회
   * GET /api/management/notices/{noticeId}
   */
  getNoticeById: async (noticeId: string) => {
    return apiCall(`/api/management/notices/${noticeId}`, {
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
 * Exhibition API
 */
export const exhibitionAPI = {
  /**
   * 전체 전시 조회 (공개)
   */
  getAllExhibitions: async () => {
    return apiCall('/api/exhibitions', {
      method: 'GET'
    });
  },

  /**
   * 현재 전시 조회 (공개)
   */
  getOngoingExhibitions: async () => {
    return apiCall('/api/exhibitions/ongoing', {
      method: 'GET'
    });
  },

  /**
   * 예정 전시 조회 (공개)
   */
  getUpcomingExhibitions: async () => {
    return apiCall('/api/exhibitions/upcoming', {
      method: 'GET'
    });
  },

  /**
   * 지난 전시 조회 (공개)
   */
  getPastExhibitions: async () => {
    return apiCall('/api/exhibitions/past', {
      method: 'GET'
    });
  },

  /**
   * 개별 전시 조회 (공개)
   */
  getExhibitionById: async (id: string) => {
    return apiCall(`/api/exhibitions/${id}`, {
      method: 'GET'
    });
  },

  /**
   * 전시 생성 (관리자)
   */
  createExhibition: async (data: {
    title: string;
    artist: string;
    location: string;
    description: string;
    startDate: string;
    endDate: string;
  }, imageFile: File) => {
    const formData = new FormData();
    
    // JSON을 File 객체로 변환 (Blob 대신 File 사용)
    const jsonFile = new File(
      [JSON.stringify(data)], 
      'data.json', 
      { type: 'application/json' }
    );
    formData.append('data', jsonFile);
    formData.append('image', imageFile);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/management/exhibitions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create exhibition' }));
      throw new Error(error.message || 'Failed to create exhibition');
    }

    return await response.json();
  },

  /**
   * 전시 수정 (관리자)
   */
  updateExhibition: async (id: number, data: {
    title: string;
    artist: string;
    location: string;
    description: string;
    startDate: string;
    endDate: string;
  }, imageFile?: File) => {
    const formData = new FormData();
    
    // JSON을 File 객체로 변환 (Blob 대신 File 사용)
    const jsonFile = new File(
      [JSON.stringify(data)], 
      'data.json', 
      { type: 'application/json' }
    );
    formData.append('data', jsonFile);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/management/exhibitions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update exhibition' }));
      throw new Error(error.message || 'Failed to update exhibition');
    }

    return await response.json();
  },

  /**
   * 전시 삭제 (관리자)
   */
  deleteExhibition: async (id: number) => {
    return apiCall(`/api/management/exhibitions/${id}`, {
      method: 'DELETE'
    });
  },
};
/**
 * 홈페이지 관리 API (ADMIN, MANAGER)
 */
export const websiteAPI = {

  /**
   * Hero 이미지 조회 (공개)
   * GET /api/website/settings/hero-image
   */
  getImage: async (imageType: string) => {
    return apiCall(`/api/website/settings/images/${imageType}`, {
      method: 'GET'
    });
  },

  uploadImage: async (imageType: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/management/website/images/${imageType}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload image');
    }

    return await response.json();
  },

  /**
   * 텍스트 설정 조회 (공개)
   * GET /api/website/settings/{key}
   */
  getTextSetting: async (key: string) => {
    return apiCall(`/api/website/settings/${key}`, {
      method: 'GET'
    });
  },

  /**
   * 텍스트 설정 업데이트 (관리자)
   * PUT /api/management/website/{key}
   */
  updateTextSetting: async (key: string, value: string) => {
    return apiCall(`/api/management/website/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value })
    });
  },

  /**
   * 홈페이지 설정 조회
   * GET /api/website/settings
   */
  getSettings: async () => {
    return apiCall('/api/website/settings', {
      method: 'GET'
    });
  },

};

/**
 * Collection API
 */
export const collectionAPI = {
  /**
   * 전체 소장품 조회 (공개)
   * GET /api/collections
   */
  getAllCollections: async () => {
    return apiCall('/api/collections', {
      method: 'GET'
    });
  },

  /**
   * 개별 소장품 조회 (공개)
   * GET /api/collections/{id}
   */
  getCollectionById: async (id: string) => {
    return apiCall(`/api/collections/${id}`, {
      method: 'GET'
    });
  },

  /**
   * 소장품 생성 (관리자)
   * POST /api/management/collections
   */
  createCollection: async (data: {
    title: string;
    year: string;
    size: string;
    description: string;
    artist: string;
    isPinned: boolean;
  }, imageFile: File) => {
    const formData = new FormData();
    
    // JSON 데이터를 Blob으로 변환하여 추가
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    formData.append('image', imageFile);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/management/collections`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create collection' }));
      throw new Error(error.message || 'Failed to create collection');
    }

    return await response.json();
  },

  /**
   * 소장품 수정 (관리자)
   * PUT /api/management/collections/{id}
   */
  updateCollection: async (id: string, data: {
    title: string;
    year: string;
    size: string;
    description: string;
    artist: string;
    isPinned: boolean;
  }, imageFile?: File) => {
    const formData = new FormData();
    
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/management/collections/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update collection' }));
      throw new Error(error.message || 'Failed to update collection');
    }

    return await response.json();
  },

  /**
   * 소장품 삭제 (관리자)
   * DELETE /api/management/collections/{id}
   */
  deleteCollection: async (id: string) => {
    return apiCall(`/api/management/collections/${id}`, {
      method: 'DELETE'
    });
  },

};

/**
 * 기념품 API
 */
export const souvenirAPI = {
  /**
   * 모든 기념품 조회
   * GET /api/souvenirs
   */
  getAllSouvenirs: async () => {
    return apiCall('/api/souvenirs', {
      method: 'GET'
    });
  },

  /**
   * 특정 기념품 조회
   * GET /api/souvenirs/{id}
   */
  getSouvenirById: async (id: number) => {
    return apiCall(`/api/souvenirs/${id}`, {
      method: 'GET'
    });
  },

  /**
   * 기념품 생성 (관리자)
   * POST /api/management/souvenirs
   */
  createSouvenir: async (data: {
    name: string;
    description: string;
    price: number;
    isPinned: boolean;
  }, imageFile: File) => {
    const formData = new FormData();
    
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    formData.append('image', imageFile);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/management/souvenirs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create souvenir' }));
      throw new Error(error.message || 'Failed to create souvenir');
    }

    return await response.json();
  },

  /**
   * 기념품 수정 (관리자)
   * PUT /api/management/souvenirs/{id}
   */
  updateSouvenir: async (id: number, data: {
    name?: string;
    description?: string;
    price?: number;
    isPinned?: boolean;
  }, imageFile?: File) => {
    const formData = new FormData();
    
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/management/souvenirs/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update souvenir' }));
      throw new Error(error.message || 'Failed to update souvenir');
    }

    return await response.json();
  },

  /**
   * 기념품 삭제 (관리자)
   * DELETE /api/management/souvenirs/{id}
   */
  deleteSouvenir: async (id: number) => {
    return apiCall(`/api/management/souvenirs/${id}`, {
      method: 'DELETE'
    });
  },
};



export default apiCall;