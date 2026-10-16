import { apiCall } from './client';

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

/**
 * 사용자 API
 */
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
};

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
   * 사용자 추가 (관리자전용)
   * POST /api/admin/users
   */
  createUser: async (email: string, username: string, password: string, name: string) => {
    return apiCall('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, name})
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
