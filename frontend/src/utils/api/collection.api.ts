import { apiCall, API_BASE_URL } from './client';

/**
 * Collection API
 */
export const collectionAPI = {
  /**
   * 전체 소장품 조회 (공개)
   * GET /api/collections
   */
  getAllCollections: async () => {
    const response = await apiCall('/api/collections', {
      method: 'GET'
    });
    // 서버가 PagedResponse 형식으로 반환하는 경우 data 배열만 반환
    return response.data || response;
  },

  /**
   * 소장품 조회 with 페이지네이션 및 필터링 (공개)
   * GET /api/collections?page=1&limit=10&search=...&yearFrom=...&yearTo=...
   */
  getCollections: async (params: {
    page: number;
    limit: number;
    search?: string;
    yearFrom?: string;
    yearTo?: string;
  }) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.yearFrom) {
      queryParams.append('yearFrom', params.yearFrom);
    }
    if (params.yearTo) {
      queryParams.append('yearTo', params.yearTo);
    }

    return apiCall(`/api/collections?${queryParams.toString()}`, {
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
   * 랜덤 소장품 조회 (공개)
   * GET /api/collections/random?count=5&exclude={id}
   */
  getRandomCollections: async (count: number = 5, exclude?: number) => {
    const queryParams = new URLSearchParams({
      count: count.toString(),
    });

    if (exclude !== undefined) {
      queryParams.append('exclude', exclude.toString());
    }

    return apiCall(`/api/collections/random?${queryParams.toString()}`, {
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
