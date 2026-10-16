import { apiCall } from './client';

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
