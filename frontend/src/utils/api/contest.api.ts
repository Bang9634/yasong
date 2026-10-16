import { apiCall, API_BASE_URL } from './client';

/**
 * Contest API
 */
export const contestAPI = {
  /**
   * 공모전 조회 with 페이지네이션 및 필터링 (공개)
   * GET /api/contests?page=1&limit=10&search=...&status=...
   */
  getContests: async (params: {
    page: number;
    limit: number;
    search?: string;
    status?: string; // ongoing, upcoming, past
  }) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.status) {
      queryParams.append('status', params.status);
    }

    return apiCall(`/api/contests?${queryParams.toString()}`, {
      method: 'GET'
    });
  },

  /**
   * 전체 공모전 조회 (공개)
   */
  getAllContests: async () => {
    return apiCall('/api/contests?page=1&limit=1000', {
      method: 'GET'
    });
  },

  /**
   * 진행 중인 공모전 조회 (공개)
   */
  getOngoingContests: async () => {
    return apiCall('/api/contests?status=ongoing&limit=100', {
      method: 'GET'
    });
  },

  /**
   * 진행 예정 공모전 조회 (공개)
   */
  getUpcomingContests: async () => {
    return apiCall('/api/contests?status=upcoming&limit=100', {
      method: 'GET'
    });
  },

  /**
   * 종료된 공모전 조회 (공개)
   */
  getPastContests: async () => {
    return apiCall('/api/contests?status=past&limit=100', {
      method: 'GET'
    });
  },

  /**
   * 개별 공모전 조회 (공개)
   */
  getContestById: async (id: string | number) => {
    return apiCall(`/api/contests/${id}`, {
      method: 'GET'
    });
  },

  /**
   * 공모전 생성 (관리자)
   */
  createContest: async (data: {
    title: string;
    location: string;
    host: string;
    description: string;
    announcementUrl: string;
    startDate: string;
    endDate: string;
  }, imageFile: File) => {
    const formData = new FormData();
    
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    formData.append('image', imageFile);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/management/contests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create contest' }));
      throw new Error(error.message || 'Failed to create contest');
    }

    return await response.json();
  },

  /**
   * 공모전 수정 (관리자)
   */
  updateContest: async (id: number, data: {
    title: string;
    location: string;
    host: string;
    description: string;
    announcementUrl: string;
    startDate: string;
    endDate: string;
  }, imageFile?: File) => {
    const formData = new FormData();
    
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/management/contests/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update contest' }));
      throw new Error(error.message || 'Failed to update contest');
    }

    return await response.json();
  },

  /**
   * 공모전 삭제 (관리자)
   */
  deleteContest: async (id: number) => {
    return apiCall(`/api/management/contests/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * 관리자 - 첨부파일 업로드
   * POST /api/management/contests/{contestId}/attachments
   */
  uploadAttachment: async (contestId: string | number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/api/management/contests/${contestId}/attachments`;
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
   * GET /api/management/contests/{contestId}/attachments
   */
  getAttachments: async (contestId: string | number) => {
    return apiCall(`/api/management/contests/${contestId}/attachments`, {
      method: 'GET'
    });
  },

  /**
   * 관리자 - 첨부파일 삭제
   * DELETE /api/management/contests/{contestId}/attachments/{attachmentId}
   */
  deleteAttachment: async (contestId: string | number, attachmentId: number) => {
    return apiCall(`/api/management/contests/${contestId}/attachments/${attachmentId}`, {
      method: 'DELETE'
    });
  },
};
