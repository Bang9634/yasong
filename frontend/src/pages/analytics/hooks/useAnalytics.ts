import { useState, useEffect } from 'react';
import { analyticsAPI } from '@/utils/api';
import type { OverviewMetrics, DailyMetric, AnalyticsData } from '../types';

export function useAnalytics(
  activeTab: 'summary' | 'full',
  selectedDays: number,
  enabled: boolean
) {
  const [summaryData, setSummaryData] = useState<OverviewMetrics | null>(null);
  const [summaryDailyData, setSummaryDailyData] = useState<DailyMetric[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 요약 정보 로드
  useEffect(() => {
    if (activeTab === 'summary' && enabled) {
      loadSummary();
    }
  }, [activeTab, enabled]);

  // 전체 통계 로드
  useEffect(() => {
    if (activeTab === 'full' && enabled) {
      loadAnalytics();
    }
  }, [activeTab, selectedDays, enabled]);

  const loadSummary = async () => {
    try {
      setIsLoading(true);
      const [summaryResponse, weekDataResponse] = await Promise.all([
        analyticsAPI.getSummary(),
        analyticsAPI.getAnalytics(7),
      ]);
      setSummaryData(summaryResponse);
      // 날짜순으로 정렬 (오름차순)
      const sortedDailyData = (weekDataResponse.dailyMetrics || []).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setSummaryDailyData(sortedDailyData);
    } catch (error) {
      console.error('요약 정보 로드 실패:', error);
      alert('요약 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsAPI.getAnalytics(selectedDays);
      // 날짜순으로 정렬 (오름차순)
      if (data.dailyMetrics) {
        data.dailyMetrics = data.dailyMetrics.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }
      setAnalyticsData(data);
    } catch (error) {
      console.error('통계 로드 실패:', error);
      alert('통계를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return { summaryData, summaryDailyData, analyticsData, isLoading };
}
