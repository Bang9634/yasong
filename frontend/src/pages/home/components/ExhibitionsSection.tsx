import {
  EXHIBITION_TYPE_FILTERS,
  getExhibitionTypeLabel,
  type ExhibitionType,
  type ExhibitionTypeFilter,
} from '@/utils/exhibitionTypes';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Calendar, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { exhibitionAPI } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

interface Exhibition {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
  type: ExhibitionType;
  startDate: string;
  endDate: string;
  status: 'ONGOING' | 'UPCOMING' | 'PAST';
}

export function ExhibitionsSection() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩
  const [isDataLoading, setIsDataLoading] = useState(false); // 데이터 변경 로딩
  const [isTransitioning, setIsTransitioning] = useState(false); // 애니메이션 상태
  const {
    setScrollContainerRef,
    showLeftArrow,
    showRightArrow,
    scrollProgress,
    scrollBarWidth,
    scroll,
  } = useHorizontalScroll(exhibitions);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExhibitionTypeFilter>('ALL');
  const [allCategoryData, setAllCategoryData] = useState<
    Partial<Record<ExhibitionTypeFilter, Exhibition[]>>
  >({}); // 카테고리별 캐시
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const navigate = useNavigate();

  // Intersection Observer로 애니메이션 트리거
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
  }, [exhibitions, isLoading]);

  // 초기 로드: 모든 카테고리 데이터 한 번에 가져오기
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setIsLoading(true);

        // 카테고리별로 전시 가져오기
        const allResults: Partial<Record<ExhibitionTypeFilter, Exhibition[]>> = {};

        for (const { value: category } of EXHIBITION_TYPE_FILTERS) {
          const typeParam = category === 'ALL' ? undefined : category;

          // 전시 중, 전시 예정, 지난 전시를 각각 가져오기
          const [ongoing, upcoming, past] = await Promise.all([
            exhibitionAPI.getExhibitions({
              page: 1,
              limit: 100,
              status: 'ongoing',
              ...(typeParam && { type: typeParam }),
            }),
            exhibitionAPI.getExhibitions({
              page: 1,
              limit: 100,
              status: 'upcoming',
              ...(typeParam && { type: typeParam }),
            }),
            exhibitionAPI.getExhibitions({
              page: 1,
              limit: 100,
              status: 'past',
              ...(typeParam && { type: typeParam }),
            }),
          ]);

          const ongoingList = ongoing.content || [];
          const upcomingList = upcoming.content || [];
          const pastList = past.content || [];

          // 전시 중 + 전시 예정
          const activeExhibitions = [...ongoingList, ...upcomingList];

          // 전시 중 + 전시 예정이 6개 미만이면 지난 전시로 채우기
          let finalExhibitions: Exhibition[];
          if (activeExhibitions.length >= 6) {
            finalExhibitions = activeExhibitions.slice(0, 6);
          } else {
            const needed = 6 - activeExhibitions.length;
            finalExhibitions = [...activeExhibitions, ...pastList.slice(0, needed)];
          }

          allResults[category] = finalExhibitions;
        }

        setAllCategoryData(allResults);
        setExhibitions(allResults.ALL || []);
        isInitialLoad.current = false;
      } catch (err) {
        console.error('전시 조회 실패:', err);
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
      setExhibitions(allCategoryData[selectedCategory] || []);

      // Fade in
      await new Promise((resolve) => setTimeout(resolve, 50));
      setIsTransitioning(false);
    };

    changeCategory();
  }, [selectedCategory, allCategoryData]);

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${import.meta.env.VITE_API_BASE_URL || ''}${imageUrl}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return (
          <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs rounded-full">
            전시 중
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs rounded-full">
            전시 예정
          </span>
        );
      case 'PAST':
        return (
          <span className="inline-block px-3 py-1 bg-gray-600 text-white text-xs rounded-full">
            지난 전시
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <section id="exhibitions" className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="exhibitions"
      className="min-h-screen bg-[#F4F4F0] pt-32 pb-16 flex flex-col relative"
    >
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
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] tracking-tight">전시</h2>
            <button
              onClick={() => navigate('/exhibitions')}
              className="flex items-center gap-2 text-[#2C2C2C] hover:text-[#C84630] transition-colors text-sm font-medium"
            >
              View More <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 카테고리 탭 */}
          <div className="flex gap-4 border-b border-[#2C2C2C]/20 overflow-x-auto scrollbar-hide">
            {EXHIBITION_TYPE_FILTERS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(tab.value)}
                className={`pb-3 px-4 font-medium transition-all relative whitespace-nowrap ${
                  selectedCategory === tab.value
                    ? 'text-[#C84630]'
                    : 'text-[#2C2C2C]/60 hover:text-[#2C2C2C]'
                }`}
              >
                {tab.label}
                {selectedCategory === tab.value && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 카드 스크롤 영역 */}
        {exhibitions.length === 0 ? (
          <div className="flex items-center justify-center text-[#2C2C2C]/60 h-[500px]">
            {selectedCategory === 'ALL'
              ? '현재 예정된 전시가 없습니다.'
              : `${getExhibitionTypeLabel(selectedCategory)} 항목이 없습니다.`}
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
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#2C2C2C] hover:bg-[#C84630] text-[#F4F4F0] rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* 스크롤 가이드 - 오른쪽 화살표 */}
            {showRightArrow && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#2C2C2C] hover:bg-[#C84630] text-[#F4F4F0] rounded-full flex items-center justify-center shadow-lg transition-colors"
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
                {exhibitions.map((exhibition) => (
                  <div
                    key={exhibition.id}
                    onClick={() => navigate(`/exhibitions/${exhibition.id}`)}
                    className="flex-shrink-0 w-64 h-full flex flex-col cursor-pointer group"
                  >
                    {/* 포스터 이미지 */}
                    <div className="relative overflow-hidden flex justify-center flex-shrink-0">
                      <ImageWithFallback
                        src={getImageUrl(exhibition.imageUrl)}
                        alt={exhibition.title}
                        className="w-[70%] aspect-[3/4] object-cover group-hover:opacity-90 transition-opacity duration-300"
                      />
                      {/* 상태 배지 */}
                      <div className={'absolute top-2 right-2 flex flex-wrap gap-2'}>
                        {getStatusBadge(exhibition.status)}
                      </div>
                    </div>

                    {/* 구분선 */}
                    <div className="w-full h-px bg-[#2C2C2C]/20 mb-1.5 sm:mb-2 lg:mb-2.5"></div>

                    {/* 텍스트 정보 */}
                    <div className="flex flex-col flex-1 min-h-0">
                      {/* 제목 - 2줄 고정 */}
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#2C2C2C] group-hover:text-[#C84630] transition-colors line-clamp-2 mb-1 sm:mb-1.5">
                        {exhibition.title}
                      </h3>

                      {/* 설명 - 2줄 고정 */}
                      <p className="text-xs sm:text-sm text-[#2C2C2C]/70 leading-relaxed line-clamp-2 mb-1.5 sm:mb-2 lg:mb-2.5 flex-1">
                        {exhibition.description}
                      </p>

                      {/* 하단 고정 영역 */}
                      <div className="mt-auto space-y-1 sm:space-y-1.5">
                        {/* 날짜 */}
                        <div className="flex items-center text-[10px] sm:text-[11px]  text-[#2C2C2C]/60">
                          <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                          <span>
                            {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                          </span>
                        </div>
                        {/* 전시 장소 */}
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#2C2C2C]/60 mb-1 sm:mb-1.5">
                          <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                          <span className="line-clamp-1">{exhibition.location}</span>
                        </div>

                        {/* 전시 종류 */}
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          <span className="inline-block px-2 sm:px-2.5 py-0.5 bg-[#2C2C2C] text-[#F4F4F0] text-[10px] sm:text-[11px] rounded-full">
                            {getExhibitionTypeLabel(exhibition.type)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 스크롤 가이드 바 */}
            <div className="mt-8 w-full max-w-md mx-auto">
              <div className="relative h-1 bg-[#2C2C2C]/20 rounded-full">
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
