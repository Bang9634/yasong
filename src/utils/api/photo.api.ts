import { apiCall, API_BASE_URL } from './client';

/**
 * Photo API
 */
export const photoAPI = {
  /**
   * 사진 자료 조회 with 페이지네이션 (공개)
   * GET /api/photos?page=1&limit=12&search=...
   */
  getPhotos: async (params: {
    page: number;
    limit: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    if (params.search) {
      queryParams.append('search', params.search);
    }

    return apiCall(`/api/photos?${queryParams.toString()}`, {
      method: 'GET'
    });
  },

  /**
   * 개별 사진 자료 조회 (공개)
   */
  getPhotoById: async (id: string | number) => {
    return apiCall(`/api/photos/${id}`, {
      method: 'GET'
    });
  },

  /**
   * 사진 자료 생성 (관리자)
   */
  createPhoto: async (data: {
    title: string;
    description: string;
  }, imageFile: File) => {
    const formData = new FormData();
    
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    formData.append('image', imageFile);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/management/photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create photo' }));
      throw new Error(error.message || 'Failed to create photo');
    }

    return await response.json();
  },

  /**
   * 사진 자료 수정 (관리자)
   */
  updatePhoto: async (id: number, data: {
    title: string;
    description: string;
  }, imageFile?: File) => {
    const formData = new FormData();
    
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/management/photos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update photo' }));
      throw new Error(error.message || 'Failed to update photo');
    }

    return await response.json();
  },

  /**
   * 사진 자료 삭제 (관리자)
   */
  deletePhoto: async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/management/photos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete photo' }));
      throw new Error(error.message || 'Failed to delete photo');
    }

    return;
  },
};
