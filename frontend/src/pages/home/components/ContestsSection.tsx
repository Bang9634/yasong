import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Calendar, MapPin, User } from 'lucide-react';
import { contestAPI, getFullImageUrl } from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

interface ContestItem {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  host: string;
  description: string;
  announcementUrl: string;
  startDate: string;
  endDate: string;
  status: 'ONGOING' | 'UPCOMING' | 'PAST';
  createdAt: string;
  updatedAt: string;
}

export function ContestsSection() {
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const {
    setScrollContainerRef,
    showLeftArrow,
    showRightArrow,
    scrollProgress,
    scrollBarWidth,
    scroll,
  } = useHorizontalScroll(contests);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ongoing' | 'upcoming' | 'past'>(
    'all'
  );
  const [allCategoryData, setAllCategoryData] = useState<{ [key: string]: ContestItem[] }>({});
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const navigate = useNavigate();

  // Intersection Observer
  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsHeaderVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const cardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsCardsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const headerElement = headerRef.current;
    const cardsElement = cardsRef.current;

    if (headerElement) headerObserver.observe(headerElement);
    if (cardsElement) cardsObserver.observe(cardsElement);

    return () => {
      if (headerElement) headerObserver.unobserve(headerElement);
      if (cardsElement) cardsObserver.unobserve(cardsElement);
    };
  }, [contests, isLoading]);

  // 공모전 데이터 가져오기 (초기 로드: 모든 카테고리 데이터 캐싱)
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setIsLoading(true);

        // 각 카테고리별로 데이터 가져오기
        const [all, ongoing, upcoming, past] = await Promise.all([
          contestAPI.getContests({ page: 1, limit: 100 }),
          contestAPI.getContests({ page: 1, limit: 100, status: 'ongoing' }),
          contestAPI.getContests({ page: 1, limit: 100, status: 'upcoming' }),
          contestAPI.getContests({ page: 1, limit: 100, status: 'past' }),
        ]);

        // 상태 순으로 정렬 (진행 중 → 진행 예정 → 종료됨)
        const statusOrder = { ONGOING: 0, UPCOMING: 1, PAST: 2 };
        const sortContests = (contests: ContestItem[]) => {
          return contests.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        };

        const allResults = {
          all: sortContests(all.content || []).slice(0, 6),
          ongoing: (ongoing.content || []).slice(0, 6),
          upcoming: (upcoming.content || []).slice(0, 6),
          past: (past.content || []).slice(0, 6),
        };

        setAllCategoryData(allResults);
        setContests(allResults.all);
        isInitialLoad.current = false;
      } catch (err) {
        console.error('공모전 데이터 조회 실패:', err);
        setContests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  // 카테고리 변경 시: 캐시된 데이터 사용 + 애니메이션
  useEffect(() => {
    if (isInitialLoad.current) return;

    const changeCategory = async () => {
      setIsTransitioning(true);

      // Fade out
      await new Promise((resolve) => setTimeout(resolve, 150));

      // 데이터 변경
      setContests(allCategoryData[selectedCategory] || []);

      // Fade in
      await new Promise((resolve) => setTimeout(resolve, 50));
      setIsTransitioning(false);
    };

    changeCategory();
  }, [selectedCategory, allCategoryData]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const getStatusDisplayName = (status: string) => {
    const statusMap: { [key: string]: string } = {
      ONGOING: '진행 중',
      UPCOMING: '진행 예정',
      PAST: '종료됨',
    };
    return statusMap[status] || status;
  };

  const handleCardClick = (contest: ContestItem) => {
    navigate(`/contests/${contest.id}`);
  };

  return (
    <section id="contest" className="min-h-screen bg-[#2C2C2C] pt-32 pb-16 flex flex-col relative">
      <style>{`
        .fade-in-header {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .fade-in-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .slide-in-cards {
          opacity: 0;
          transform: translateX(100px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .slide-in-cards.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* 헤더 */}
        <div ref={headerRef} className={`mb-8 fade-in-header ${isHeaderVisible ? 'visible' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#F4F4F0] tracking-tight">공모전</h2>
            <button
              onClick={() => navigate('/contests')}
              className="flex items-center gap-2 text-[#F4F4F0] hover:text-[#C84630] transition-colors text-sm font-medium"
            >
              View More <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 카테고리 탭 */}
          <div className="flex gap-4 border-b border-[#F4F4F0]/20">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`pb-3 px-4 font-medium transition-all relative ${
                selectedCategory === 'all'
                  ? 'text-[#C84630]'
                  : 'text-[#F4F4F0]/60 hover:text-[#F4F4F0]'
              }`}
            >
              전체
              {selectedCategory === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
              )}
            </button>
            <button
              onClick={() => setSelectedCategory('ongoing')}
              className={`pb-3 px-4 font-medium transition-all relative ${
                selectedCategory === 'ongoing'
                  ? 'text-[#C84630]'
                  : 'text-[#F4F4F0]/60 hover:text-[#F4F4F0]'
              }`}
            >
              진행 중
              {selectedCategory === 'ongoing' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
              )}
            </button>
            <button
              onClick={() => setSelectedCategory('upcoming')}
              className={`pb-3 px-4 font-medium transition-all relative ${
                selectedCategory === 'upcoming'
                  ? 'text-[#C84630]'
                  : 'text-[#F4F4F0]/60 hover:text-[#F4F4F0]'
              }`}
            >
              진행 예정
              {selectedCategory === 'upcoming' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
              )}
            </button>
            <button
              onClick={() => setSelectedCategory('past')}
              className={`pb-3 px-4 font-medium transition-all relative ${
                selectedCategory === 'past'
                  ? 'text-[#C84630]'
                  : 'text-[#F4F4F0]/60 hover:text-[#F4F4F0]'
              }`}
            >
              종료됨
              {selectedCategory === 'past' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
              )}
            </button>
          </div>
        </div>

        {/* 카드 스크롤 영역 */}
        {isLoading ? (
          <div className="flex items-center justify-center text-[#F4F4F0]/60 h-[500px]">
            로딩 중...
          </div>
        ) : contests.length === 0 ? (
          <div className="flex items-center justify-center text-[#F4F4F0]/60 h-[500px]">
            {selectedCategory === 'all'
              ? '현재 예정된 공모전이 없습니다.'
              : selectedCategory === 'ongoing'
                ? '진행 중인 공모전이 없습니다.'
                : selectedCategory === 'upcoming'
                  ? '진행 예정인 공모전이 없습니다.'
                  : '종료된 공모전이 없습니다.'}
          </div>
        ) : (
          <div
            ref={cardsRef}
            className={`relative slide-in-cards ${isCardsVisible ? 'visible' : ''} h-[500px]`}
          >
            {/* 스크롤 가이드 - 왼쪽 화살표 */}
            {showLeftArrow && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#F4F4F0] hover:bg-[#C84630] text-[#2C2C2C] hover:text-[#F4F4F0] rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* 스크롤 가이드 - 오른쪽 화살표 */}
            {showRightArrow && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#F4F4F0] hover:bg-[#C84630] text-[#2C2C2C] hover:text-[#F4F4F0] rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div
              ref={setScrollContainerRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div
                className={`flex gap-5 pb-4 h-full transition-opacity duration-300 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {contests.map((contest) => (
                  <div
                    key={contest.id}
                    onClick={() => handleCardClick(contest)}
                    className="flex-shrink-0 w-64 h-full flex flex-col cursor-pointer group"
                  >
                    {/* 포스터 이미지 */}
                    <div className="relative overflow-hidden flex justify-center flex-shrink-0">
                      <ImageWithFallback
                        src={getFullImageUrl(contest.imageUrl)}
                        alt={contest.title}
                        className="w-[70%] aspect-[3/4] object-cover group-hover:opacity-90 transition-opacity duration-300"
                      />

                      {/* 상태 배지 */}
                      <div
                        className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs text-white ${
                          contest.status === 'ONGOING'
                            ? 'bg-green-600'
                            : contest.status === 'UPCOMING'
                              ? 'bg-orange-500'
                              : 'bg-gray-600'
                        }`}
                      >
                        {getStatusDisplayName(contest.status)}
                      </div>
                    </div>

                    {/* 구분선 */}
                    <div className="w-full h-px bg-[#F4F4F0]/20 mb-1.5 sm:mb-2 lg:mb-2.5"></div>

                    {/* 텍스트 정보 */}
                    <div className="flex flex-col flex-1 min-h-0">
                      {/* 제목 */}
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#F4F4F0] group-hover:text-[#C84630] transition-colors line-clamp-2 mb-1 sm:mb-1.5">
                        {contest.title}
                      </h3>

                      {/* 설명 */}
                      <p className="text-xs sm:text-sm text-[#F4F4F0]/70 leading-relaxed line-clamp-2 mb-1.5 sm:mb-2 lg:mb-2.5 flex-1">
                        {contest.description}
                      </p>

                      {/* 하단 고정 영역 */}
                      <div className="mt-auto space-y-1 sm:space-y-1.5">
                        {/* 날짜 */}
                        <div className="flex items-center text-[10px] sm:text-[11px] text-[#F4F4F0]/60">
                          <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                          <span>
                            {formatDate(contest.startDate)} ~ {formatDate(contest.endDate)}
                          </span>
                        </div>

                        {/* 주최자 */}
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#F4F4F0]/60">
                          <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                          <span className="line-clamp-1">{contest.host}</span>
                        </div>

                        {/* 공모 대상 */}
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#F4F4F0]/60">
                          <User className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                          <span className="line-clamp-1">{contest.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 스크롤 가이드 바 */}
            <div className="mt-8 w-full max-w-md mx-auto">
              <div className="relative h-1 bg-[#F4F4F0]/20 rounded-full">
                <div
                  className="absolute top-0 h-full bg-[#C84630] rounded-full"
                  style={{
                    left: `${scrollProgress}%`,
                    width: `${scrollBarWidth}%`,
                    transition: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
