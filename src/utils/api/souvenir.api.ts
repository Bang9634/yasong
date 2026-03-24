import { apiCall, API_BASE_URL } from './client';

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
