import { apiCall } from './client';

/**
 * Update Log API
 */
export const updateLogAPI = {
  /**
   * 업데이트 내역 목록 조회 (페이지네이션)
   * GET /api/updates
   */
  getUpdateLogs: async (params: {
    page: number;
    limit: number;
  }) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    return apiCall(`/api/updates?${queryParams.toString()}`, {
      method: 'GET'
    });
  },

  /**
   * 업데이트 내역 상세 조회
   * GET /api/updates/{id}
   */
  getUpdateLogById: async (id: string) => {
    return apiCall(`/api/updates/${id}`, {
      method: 'GET'
    });
  },

  /**
   * 관리자 - 업데이트 내역 목록 조회 (페이지네이션)
   * GET /api/management/updates
   */
  getManagementUpdateLogs: async (params: {
    page: number;
    limit: number;
  }) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    return apiCall(`/api/management/updates?${queryParams.toString()}`, {
      method: 'GET'
    });
  },

  /**
   * 관리자 - 업데이트 내역 생성
   * POST /api/management/updates
   */
  createUpdateLog: async (data: {
    title: string;
    version: string;
    updateDate: string;
    content: string;
  }) => {
    return apiCall('/api/management/updates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * 관리자 - 업데이트 내역 수정
   * PUT /api/management/updates/{id}
   */
  updateUpdateLog: async (id: string, data: {
    title: string;
    version: string;
    updateDate: string;
    content: string;
  }) => {
    return apiCall(`/api/management/updates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * 관리자 - 업데이트 내역 삭제
   * DELETE /api/management/updates/{id}
   */
  deleteUpdateLog: async (id: string) => {
    return apiCall(`/api/management/updates/${id}`, {
      method: 'DELETE'
    });
  },
};
