import { formatDuration, formatPercentage } from '@/pages/analytics/formatters';
import { Users, Eye, Clock, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import type { useAnalytics } from '../hooks/useAnalytics';

type AnalyticsSummaryProps = Pick<
  ReturnType<typeof useAnalytics>,
  'isLoading' | 'summaryData' | 'summaryDailyData'
> & {
  activeTab: 'summary' | 'full';
};

export function AnalyticsSummary({
  activeTab,
  isLoading,
  summaryData,
  summaryDailyData,
}: AnalyticsSummaryProps) {
  return (
    <>
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
                  <p className="text-3xl font-bold text-gray-900">
                    {summaryData.totalUsers.toLocaleString()}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      오늘:{' '}
                      {summaryDailyData[summaryDailyData.length - 1]?.users.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      최근 7일: {summaryData.totalUsers.toLocaleString()}
                    </p>
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
                  <p className="text-3xl font-bold text-gray-900">
                    {summaryData.sessions.toLocaleString()}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      오늘:{' '}
                      {summaryDailyData[summaryDailyData.length - 1]?.sessions.toLocaleString() ||
                        0}
                    </p>
                    <p className="text-xs text-gray-500">
                      최근 7일: {summaryData.sessions.toLocaleString()}
                    </p>
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
                  <p className="text-3xl font-bold text-gray-900">
                    {summaryData.pageViews.toLocaleString()}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      오늘:{' '}
                      {summaryDailyData[summaryDailyData.length - 1]?.pageViews.toLocaleString() ||
                        0}
                    </p>
                    <p className="text-xs text-gray-500">
                      최근 7일: {summaryData.pageViews.toLocaleString()}
                    </p>
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
                  <p className="text-3xl font-bold text-gray-900">
                    {formatDuration(summaryData.averageSessionDuration)}
                  </p>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    일별 방문자 추세 (최근 7일)
                  </h3>
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
                        points={summaryDailyData
                          .map((day, index) => {
                            const maxUsers = Math.max(...summaryDailyData.map((d) => d.users));
                            const padding = 40;
                            const x =
                              padding +
                              (index / (summaryDailyData.length - 1)) * (800 - 2 * padding);
                            const y = 276 - (day.users / maxUsers) * 240;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />

                      {/* 데이터 포인트 및 값 */}
                      {summaryDailyData.map((day, index) => {
                        const maxUsers = Math.max(...summaryDailyData.map((d) => d.users));
                        const padding = 40;
                        const x =
                          padding + (index / (summaryDailyData.length - 1)) * (800 - 2 * padding);
                        const y = 276 - (day.users / maxUsers) * 240;
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
                    <div
                      className="flex justify-between mt-2"
                      style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    >
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
    </>
  );
}
