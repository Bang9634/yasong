import { apiCall } from './client';

/**
 * Analytics API
 */
export const analyticsAPI = {
  /**
   * 요약 정보 조회 (최근 7일)
   * GET /api/admin/analytics/summary
   */
  getSummary: async () => {
    return apiCall('/api/admin/analytics/summary');
  },

  /**
   * 전체 통계 조회
   * GET /api/admin/analytics?days={days}
   */
  getAnalytics: async (days: number = 30) => {
    return apiCall(`/api/admin/analytics?days=${days}`);
  },
};
