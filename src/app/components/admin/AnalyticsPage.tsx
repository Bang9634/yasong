import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { useAuth } from '@/context/AuthContext';
import { analyticsAPI } from '@/utils/api';
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Monitor, 
  Smartphone, 
  Tablet,
  BarChart3,
  Globe,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface OverviewMetrics {
  totalUsers: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  engagementRate: number;
}

interface PageMetric {
  pagePath: string;
  pageTitle: string;
  views: number;
  uniquePageViews: number;
  averageTimeOnPage: number;
}

interface TrafficSource {
  source: string;
  medium: string;
  users: number;
  sessions: number;
  percentage: number;
}

interface DeviceMetric {
  deviceCategory: string;
  users: number;
  sessions: number;
  percentage: number;
}

interface DailyMetric {
  date: string;
  users: number;
  sessions: number;
  pageViews: number;
}

interface LocationMetric {
  country: string;
  region: string;
  city: string;
  users: number;
  sessions: number;
  pageViews: number;
  percentage: number;
}

interface AnalyticsData {
  overview: OverviewMetrics;
  topPages: PageMetric[];
  trafficSources: TrafficSource[];
  deviceBreakdown: DeviceMetric[];
  dailyMetrics: DailyMetric[];
  locationBreakdown: LocationMetric[];
}

export function AnalyticsPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'summary' | 'full'>('summary');
  const [summaryData, setSummaryData] = useState<OverviewMetrics | null>(null);
  const [summaryDailyData, setSummaryDailyData] = useState<DailyMetric[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedDays, setSelectedDays] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  // 권한 확인
  useEffect(() => {
    if (loading) return;
    
    if (!user || user.role !== 'ADMIN') {
      alert('관리자만 접근 가능합니다.');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // 요약 정보 로드
  useEffect(() => {
    if (activeTab === 'summary' && user?.role === 'ADMIN') {
      loadSummary();
    }
  }, [activeTab, user]);

  // 전체 통계 로드
  useEffect(() => {
    if (activeTab === 'full' && user?.role === 'ADMIN') {
      loadAnalytics();
    }
  }, [activeTab, selectedDays, user]);

  const loadSummary = async () => {
    try {
      setIsLoading(true);
      const [summaryResponse, weekDataResponse] = await Promise.all([
        analyticsAPI.getSummary(),
        analyticsAPI.getAnalytics(7)
      ]);
      setSummaryData(summaryResponse);
      setSummaryDailyData(weekDataResponse.dailyMetrics || []);
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
      setAnalyticsData(data);
    } catch (error) {
      console.error('통계 로드 실패:', error);
      alert('통계를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}분 ${secs}초`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getDeviceIcon = (deviceCategory: string) => {
    switch (deviceCategory.toLowerCase()) {
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

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
          <p className="text-[#2C2C2C]/70">Google Analytics 데이터를 기반으로 한 웹사이트 방문 통계입니다.</p>
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
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">로딩 중...</div>
            ) : summaryData ? (
              <>
                {/* 메트릭 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* 활성 사용자 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">활성 사용자</h3>
                    <p className="text-3xl font-bold text-gray-900">{summaryData.totalUsers.toLocaleString()}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">오늘: {summaryDailyData[summaryDailyData.length - 1]?.users.toLocaleString() || 0}</p>
                      <p className="text-xs text-gray-500">최근 7일: {summaryData.totalUsers.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* 세션 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">세션</h3>
                    <p className="text-3xl font-bold text-gray-900">{summaryData.sessions.toLocaleString()}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">오늘: {summaryDailyData[summaryDailyData.length - 1]?.sessions.toLocaleString() || 0}</p>
                      <p className="text-xs text-gray-500">최근 7일: {summaryData.sessions.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* 페이지뷰 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Eye className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">페이지뷰</h3>
                    <p className="text-3xl font-bold text-gray-900">{summaryData.pageViews.toLocaleString()}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">오늘: {summaryDailyData[summaryDailyData.length - 1]?.pageViews.toLocaleString() || 0}</p>
                      <p className="text-xs text-gray-500">최근 7일: {summaryData.pageViews.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* 평균 세션 시간 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <Clock className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">평균 세션 시간</h3>
                    <p className="text-3xl font-bold text-gray-900">{formatDuration(summaryData.averageSessionDuration)}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">최근 7일 평균</p>
                    </div>
                  </div>
                </div>

                {/* 참여율 & 이탈률 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">참여율</h3>
                      <span className="text-sm text-gray-500">지난 7일</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-green-600 h-4 rounded-full"
                            style={{ width: `${summaryData.engagementRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center">
                        <ArrowUp className="w-5 h-5 text-green-600 mr-1" />
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPercentage(summaryData.engagementRate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">이탈률</h3>
                      <span className="text-sm text-gray-500">지난 7일</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-red-600 h-4 rounded-full"
                            style={{ width: `${summaryData.bounceRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center">
                        <ArrowDown className="w-5 h-5 text-red-600 mr-1" />
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPercentage(summaryData.bounceRate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 일별 방문자 추세 (요약 정보) */}
                {summaryDailyData.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">일별 방문자 추세 (최근 7일)</h3>
                    <div className="h-80 relative">
                      <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
                        {/* 배경 그리드 */}
                        <line x1="40" y1="20" x2="760" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="40" y1="84" x2="760" y2="84" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="40" y1="148" x2="760" y2="148" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="40" y1="212" x2="760" y2="212" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="40" y1="276" x2="760" y2="276" stroke="#e5e7eb" strokeWidth="1" />
                        
                        {/* 꺾은선 그래프 */}
                        <polyline
                          fill="none"
                          stroke="#0d9488"
                          strokeWidth="3"
                          points={summaryDailyData.map((day, index) => {
                            const maxUsers = Math.max(...summaryDailyData.map(d => d.users));
                            const padding = 40;
                            const x = padding + (index / (summaryDailyData.length - 1)) * (800 - 2 * padding);
                            const y = 276 - ((day.users / maxUsers) * 240);
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                        
                        {/* 데이터 포인트 및 값 */}
                        {summaryDailyData.map((day, index) => {
                          const maxUsers = Math.max(...summaryDailyData.map(d => d.users));
                          const padding = 40;
                          const x = padding + (index / (summaryDailyData.length - 1)) * (800 - 2 * padding);
                          const y = 276 - ((day.users / maxUsers) * 240);
                          return (
                            <g key={index}>
                              <circle
                                cx={x}
                                cy={y}
                                r="6"
                                fill="#0d9488"
                                className="hover:r-8 transition-all cursor-pointer"
                              />
                              <text
                                x={x}
                                y={y - 12}
                                textAnchor="middle"
                                fontSize="12"
                                fill="#374151"
                                fontWeight="500"
                              >
                                {day.users.toLocaleString()}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                      
                      {/* X축 레이블 */}
                      <div className="flex justify-between mt-2" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
                        {summaryDailyData.map((day, index) => (
                          <span key={index} className="text-xs text-gray-500">
                            {new Date(day.date).getDate()}일
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">데이터를 불러올 수 없습니다.</div>
            )}
          </div>
        )}

        {/* 전체 통계 탭 */}
        {activeTab === 'full' && (
          <div className="space-y-6">
            {/* 기간 선택 */}
            <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <span className="text-gray-700 font-medium">조회 기간</span>
              <select
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value={7}>최근 7일</option>
                <option value={30}>최근 30일</option>
                <option value={90}>최근 90일</option>
                <option value={180}>최근 180일</option>

                <option value={365}>최근 365일</option>
              </select>
            </div>

            {isLoading ? (
              <div className="text-center py-12">로딩 중...</div>
            ) : analyticsData ? (
              <>
                {/* 개요 메트릭 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500 text-sm font-medium">총 사용자</h3>
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalUsers.toLocaleString()}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500 text-sm font-medium">세션</h3>
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.sessions.toLocaleString()}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500 text-sm font-medium">페이지뷰</h3>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.pageViews.toLocaleString()}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500 text-sm font-medium">참여율</h3>
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{formatPercentage(analyticsData.overview.engagementRate)}</p>
                  </div>
                </div>

                {/* 일별 추세 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">일별 방문자 추세</h3>
                  <div className="h-80 relative">
                    <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
                      {/* 배경 그리드 */}
                      <line x1="40" y1="20" x2="760" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="40" y1="84" x2="760" y2="84" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="40" y1="148" x2="760" y2="148" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="40" y1="212" x2="760" y2="212" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="40" y1="276" x2="760" y2="276" stroke="#e5e7eb" strokeWidth="1" />
                      
                      {/* 영역 채우기 (그라데이션) */}
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <polygon
                        fill="url(#areaGradient)"
                        points={`40,276 ${analyticsData.dailyMetrics.map((day, index) => {
                          const maxUsers = Math.max(...analyticsData.dailyMetrics.map(d => d.users));
                          const padding = 40;
                          const x = padding + (index / (analyticsData.dailyMetrics.length - 1)) * (800 - 2 * padding);
                          const y = 276 - ((day.users / maxUsers) * 240);
                          return `${x},${y}`;
                        }).join(' ')} 760,276`}
                      />
                      
                      {/* 꺾은선 그래프 */}
                      <polyline
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="3"
                        points={analyticsData.dailyMetrics.map((day, index) => {
                          const maxUsers = Math.max(...analyticsData.dailyMetrics.map(d => d.users));
                          const padding = 40;
                          const x = padding + (index / (analyticsData.dailyMetrics.length - 1)) * (800 - 2 * padding);
                          const y = 276 - ((day.users / maxUsers) * 240);
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                      
                      {/* 데이터 포인트 및 값 */}
                      {analyticsData.dailyMetrics.map((day, index) => {
                        const maxUsers = Math.max(...analyticsData.dailyMetrics.map(d => d.users));
                        const padding = 40;
                        const x = padding + (index / (analyticsData.dailyMetrics.length - 1)) * (800 - 2 * padding);
                        const y = 276 - ((day.users / maxUsers) * 240);
                        // 너무 많은 라벨은 간격을 두고 표시
                        const showLabel = analyticsData.dailyMetrics.length <= 30 || index % Math.ceil(analyticsData.dailyMetrics.length / 15) === 0;
                        return (
                          <g key={index}>
                            <circle
                              cx={x}
                              cy={y}
                              r="6"
                              fill="#0d9488"
                              className="hover:r-8 transition-all cursor-pointer"
                            />
                            {showLabel && (
                              <text
                                x={x}
                                y={y - 12}
                                textAnchor="middle"
                                fontSize="12"
                                fill="#374151"
                                fontWeight="500"
                              >
                                {day.users.toLocaleString()}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                    
                    {/* X축 레이블 */}
                    <div className="flex justify-between mt-2" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
                      {analyticsData.dailyMetrics.map((day, index) => {
                        // 레이블 간격 조정 (너무 많으면 일부만 표시)
                        const showLabel = analyticsData.dailyMetrics.length <= 30 || index % Math.ceil(analyticsData.dailyMetrics.length / 10) === 0;
                        return showLabel ? (
                          <span key={index} className="text-xs text-gray-500">
                            {new Date(day.date).getMonth() + 1}/{new Date(day.date).getDate()}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 상위 페이지 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">상위 페이지</h3>
                    <div className="space-y-3">
                      {analyticsData.topPages.map((page, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{page.pageTitle || page.pagePath}</p>
                            <p className="text-xs text-gray-500 truncate">{page.pagePath}</p>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-sm font-semibold text-teal-600">{page.views.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">조회</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 디바이스 분석 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">디바이스 분석</h3>
                    <div className="space-y-4">
                      {analyticsData.deviceBreakdown.map((device, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getDeviceIcon(device.deviceCategory)}
                              <span className="text-sm font-medium text-gray-700 capitalize">{device.deviceCategory}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{formatPercentage(device.percentage)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full"
                              style={{ width: `${device.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{device.users.toLocaleString()} 사용자</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 트래픽 소스 & 지역 분석 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 트래픽 소스 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">트래픽 소스</h3>
                    <div className="space-y-3">
                      {analyticsData.trafficSources.map((source, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{source.source}</p>
                            <p className="text-xs text-gray-500">{source.medium}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{source.users.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{formatPercentage(source.percentage)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 지역 분석 */}
                  {analyticsData.locationBreakdown && analyticsData.locationBreakdown.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Globe className="w-5 h-5 mr-2" />
                        지역별 방문자
                      </h3>
                      <div className="space-y-3">
                        {analyticsData.locationBreakdown.map((location, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{location.city}</p>
                              <p className="text-xs text-gray-500">{location.region}, {location.country}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">{location.users.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">{formatPercentage(location.percentage)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">데이터를 불러올 수 없습니다.</div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
