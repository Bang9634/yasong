import { AnalyticsDetails } from './components/AnalyticsDetails';
import { AnalyticsSummary } from './components/AnalyticsSummary';
import { useAnalytics } from './hooks/useAnalytics';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

export function AnalyticsPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'summary' | 'full'>('summary');
  const [selectedDays, setSelectedDays] = useState(30);
  const { summaryData, summaryDailyData, analyticsData, isLoading } = useAnalytics(
    activeTab,
    selectedDays,
    user?.role === 'ADMIN'
  );

  // 권한 확인
  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== 'ADMIN') {
      alert('관리자만 접근 가능합니다.');
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">로딩 중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 flex-1">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2C2C2C] mb-2">웹사이트 통계</h1>
          <p className="text-[#2C2C2C]/70">
            Google Analytics 데이터를 기반으로 한 웹사이트 방문 통계입니다.
          </p>
        </div>

        {/* 탭 */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-[#C84630] text-[#C84630]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              요약 정보
            </button>
            <button
              onClick={() => setActiveTab('full')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'full'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              전체 통계
            </button>
          </nav>
        </div>

        {/* 요약 정보 탭 */}
        <AnalyticsSummary
          activeTab={activeTab}
          isLoading={isLoading}
          summaryData={summaryData}
          summaryDailyData={summaryDailyData}
        />

        {/* 전체 통계 탭 */}
        <AnalyticsDetails
          activeTab={activeTab}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          isLoading={isLoading}
          analyticsData={analyticsData}
        />
      </div>

      <Footer />
    </div>
  );
}
