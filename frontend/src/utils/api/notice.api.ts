import { apiCall, API_BASE_URL } from './client';

/**
 * 공지사항 API
 */
export const noticeAPI = {
  /**
   * 공지사항 목록 조회 (페이지네이션)
   * GET /api/notices
   */
  getNotices: async (params: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
  }) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.category) {
      queryParams.append('category', params.category);
    }

    return apiCall(`/api/notices?${queryParams.toString()}`, {
      method: 'GET'
    });
  },

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
   * 관리자 - 공지사항 목록 조회 (페이지네이션 + 필터)
   * GET /api/management/notices/paged
   */
  getManagementNotices: async (params: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.category) {
      queryParams.append('category', params.category);
    }
    if (params.status) {
      queryParams.append('status', params.status);
    }

    return apiCall(`/api/management/notices?${queryParams.toString()}`, {
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

  /**
   * 관리자 - 첨부파일 업로드
   * POST /api/management/notices/{noticeId}/attachments
   */
  uploadAttachment: async (noticeId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/api/management/notices/${noticeId}/attachments`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * 관리자 - 첨부파일 목록 조회
   * GET /api/management/notices/{noticeId}/attachments
   */
  getAttachments: async (noticeId: string) => {
    return apiCall(`/api/management/notices/${noticeId}/attachments`, {
      method: 'GET'
    });
  },

  /**
   * 관리자 - 첨부파일 삭제
   * DELETE /api/management/notices/{noticeId}/attachments/{attachmentId}
   */
  deleteAttachment: async (noticeId: string, attachmentId: number) => {
    return apiCall(`/api/management/notices/${noticeId}/attachments/${attachmentId}`, {
      method: 'DELETE'
    });
  },

  /**
   * 관리자 - 공지사항 본문용 이미지 업로드
   * POST /api/management/notices/upload-image
   */
  uploadContentImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/api/management/notices/upload-image`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};
