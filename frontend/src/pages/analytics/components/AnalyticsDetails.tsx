import { formatPercentage } from '@/pages/analytics/formatters';
import { getDeviceIcon } from '@/pages/analytics/components/DeviceIcon';
import { Users, Eye, TrendingUp, BarChart3, Globe } from 'lucide-react';
import type { useAnalytics } from '../hooks/useAnalytics';

type AnalyticsDetailsProps = Pick<
  ReturnType<typeof useAnalytics>,
  'isLoading' | 'analyticsData'
> & {
  activeTab: 'summary' | 'full';
  selectedDays: number;
  setSelectedDays: (days: number) => void;
};

export function AnalyticsDetails({
  activeTab,
  selectedDays,
  setSelectedDays,
  isLoading,
  analyticsData,
}: AnalyticsDetailsProps) {
  return (
    <>
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
                  <p className="text-3xl font-bold text-gray-900">
                    {analyticsData.overview.totalUsers.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">세션</h3>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {analyticsData.overview.sessions.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">페이지뷰</h3>
                    <Eye className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {analyticsData.overview.pageViews.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">참여율</h3>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPercentage(analyticsData.overview.engagementRate)}
                  </p>
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
                      points={`40,276 ${analyticsData.dailyMetrics
                        .map((day, index) => {
                          const maxUsers = Math.max(
                            ...analyticsData.dailyMetrics.map((d) => d.users)
                          );
                          const padding = 40;
                          const x =
                            padding +
                            (index / (analyticsData.dailyMetrics.length - 1)) * (800 - 2 * padding);
                          const y = 276 - (day.users / maxUsers) * 240;
                          return `${x},${y}`;
                        })
                        .join(' ')} 760,276`}
                    />

                    {/* 꺾은선 그래프 */}
                    <polyline
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="3"
                      points={analyticsData.dailyMetrics
                        .map((day, index) => {
                          const maxUsers = Math.max(
                            ...analyticsData.dailyMetrics.map((d) => d.users)
                          );
                          const padding = 40;
                          const x =
                            padding +
                            (index / (analyticsData.dailyMetrics.length - 1)) * (800 - 2 * padding);
                          const y = 276 - (day.users / maxUsers) * 240;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />

                    {/* 데이터 포인트 및 값 */}
                    {analyticsData.dailyMetrics.map((day, index) => {
                      const maxUsers = Math.max(...analyticsData.dailyMetrics.map((d) => d.users));
                      const padding = 40;
                      const x =
                        padding +
                        (index / (analyticsData.dailyMetrics.length - 1)) * (800 - 2 * padding);
                      const y = 276 - (day.users / maxUsers) * 240;
                      // 너무 많은 라벨은 간격을 두고 표시
                      const showLabel =
                        analyticsData.dailyMetrics.length <= 30 ||
                        index % Math.ceil(analyticsData.dailyMetrics.length / 15) === 0;
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
                  <div
                    className="flex justify-between mt-2"
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  >
                    {analyticsData.dailyMetrics.map((day, index) => {
                      // 레이블 간격 조정 (너무 많으면 일부만 표시)
                      const showLabel =
                        analyticsData.dailyMetrics.length <= 30 ||
                        index % Math.ceil(analyticsData.dailyMetrics.length / 10) === 0;
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
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {page.pageTitle || page.pagePath}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{page.pagePath}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-sm font-semibold text-teal-600">
                            {page.views.toLocaleString()}
                          </p>
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
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {device.deviceCategory}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatPercentage(device.percentage)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-teal-600 h-2 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {device.users.toLocaleString()} 사용자
                        </p>
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
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{source.source}</p>
                          <p className="text-xs text-gray-500">{source.medium}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {source.users.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatPercentage(source.percentage)}
                          </p>
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
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">{location.city}</p>
                            <p className="text-xs text-gray-500">
                              {location.region}, {location.country}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {location.users.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatPercentage(location.percentage)}
                            </p>
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
    </>
  );
}
