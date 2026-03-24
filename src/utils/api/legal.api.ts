import { apiCall } from './client';

/**
 * Legal Term API
 */
export const legalAPI = {
  /**
   * 특정 약관 조회 (공개)
   * GET /api/legal/{id}
   */
  getTermById: async (id: number) => {
    return apiCall(`/api/legal/${id}`, {
      method: 'GET'
    });
  },

  /**
   * 현재 활성화된 약관 조회 (공개)
   * GET /api/legal/type/{type}/current
   */
  getCurrentTerm: async (type: 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY') => {
    return apiCall(`/api/legal/type/${type}/current`, {
      method: 'GET'
    });
  },

  /**
   * 약관 히스토리 목록 조회 (공개)
   * GET /api/legal/type/{type}/history
   */
  getTermHistory: async (type: 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY') => {
    return apiCall(`/api/legal/type/${type}/history`, {
      method: 'GET'
    });
  },

  /**
   * 약관 생성 (관리자)
   * POST /api/management/legal
   */
  createTerm: async (data: {
    type: 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY';
    version: string;
    content: string;
    startDate: string;
    endDate?: string;
  }) => {
    return apiCall('/api/management/legal', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * 약관 수정 (관리자)
   * PUT /api/management/legal/{id}
   */
  updateTerm: async (id: number, data: {
    version: string;
    content: string;
    startDate: string;
    endDate?: string;
  }) => {
    return apiCall(`/api/management/legal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * 약관 삭제 (관리자)
   * DELETE /api/management/legal/{id}
   */
  deleteTerm: async (id: number) => {
    return apiCall(`/api/management/legal/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * 약관 활성화 (관리자)
   * POST /api/management/legal/{id}/activate
   */
  activateTerm: async (id: number) => {
    return apiCall(`/api/management/legal/${id}/activate`, {
      method: 'POST'
    });
  },
};
