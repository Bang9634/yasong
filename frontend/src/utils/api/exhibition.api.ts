import type { ExhibitionType } from '../exhibitionTypes';
import { apiCall, API_BASE_URL } from './client';

/**
 * Exhibition API
 */
export const exhibitionAPI = {
  /**
   * 전시 조회 with 페이지네이션 및 필터링 (공개)
   * GET /api/exhibitions?page=1&limit=10&search=...&status=...&type=...
   */
  getExhibitions: async (params: {
    page: number;
    limit: number;
    search?: string;
    status?: string; // ongoing, upcoming, past
    type?: ExhibitionType;
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
    if (params.type) {
      queryParams.append('type', params.type);
    }

    return apiCall(`/api/exhibitions?${queryParams.toString()}`, {
      method: 'GET'
    });
  },

  /**
   * 전체 전시 조회 (공개) - 레거시 호환용
   */
  getAllExhibitions: async () => {
    return apiCall('/api/exhibitions?page=1&limit=1000', {
      method: 'GET'
    });
  },

  /**
   * 현재 전시 조회 (공개)
   */
  getOngoingExhibitions: async () => {
    return apiCall('/api/exhibitions?status=ongoing&limit=100', {
      method: 'GET'
    });
  },

  /**
   * 예정 전시 조회 (공개)
   */
  getUpcomingExhibitions: async () => {
    return apiCall('/api/exhibitions?status=upcoming&limit=100', {
      method: 'GET'
    });
  },

  /**
   * 지난 전시 조회 (공개)
   */
  getPastExhibitions: async () => {
    return apiCall('/api/exhibitions?status=past&limit=100', {
      method: 'GET'
    });
  },

  /**
   * 개별 전시 조회 (공개)
   */
  getExhibitionById: async (id: string | number) => {
    return apiCall(`/api/exhibitions/${id}`, {
      method: 'GET'
    });
  },

  /**
   * 전시 생성 (관리자)
   */
  createExhibition: async (data: {
    title: string;
    location: string;
    description: string;
    type: ExhibitionType;
    startDate: string;
    endDate: string;
  }, imageFile: File) => {
    const formData = new FormData();
    
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
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
    location: string;
    description: string;
    type: ExhibitionType;
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
