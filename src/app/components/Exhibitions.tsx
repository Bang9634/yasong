import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Calendar, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { exhibitionAPI } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

interface Exhibition {
  id: number;
  title: string;
  artist: string;
  location: string;
  imageUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'ONGOING' | 'UPCOMING' | 'PAST';
  category?: 'memorial' | 'retrospective';
}

export function Exhibitions() {
  const [currentExhibitions, setCurrentExhibitions] = useState<Exhibition[]>([]);
  const [upcomingExhibitions, setUpcomingExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollBarWidth, setScrollBarWidth] = useState(20);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'memorial' | 'retrospective'>('all');
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 스크롤 위치 확인
  const checkScroll = () => {
    if (scrollContainerRef) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef;
      setIsScrollable(scrollWidth > clientWidth);
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      
      // 스크롤 바 인디케이터 너비 계산 (보이는 영역 비율)
      const visibleRatio = clientWidth / scrollWidth;
      const indicatorWidth = Math.max(5, Math.min(visibleRatio * 100, 30)); // 최소 5%, 최대 30%
      setScrollBarWidth(indicatorWidth);
      
      // 스크롤 진행률 계산 (인디케이터가 범위를 벗어나지 않도록)
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - indicatorWidth) : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    if (scrollContainerRef) {
      checkScroll();
      scrollContainerRef.addEventListener('scroll', checkScroll);
      return () => scrollContainerRef.removeEventListener('scroll', checkScroll);
    }
  }, [scrollContainerRef, currentExhibitions, upcomingExhibitions]);

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
  }, [currentExhibitions, upcomingExhibitions, isLoading]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef) {
      const scrollAmount = 400;
      scrollContainerRef.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        setIsLoading(true);
        const [ongoing, upcoming] = await Promise.all([
          exhibitionAPI.getOngoingExhibitions(),
          exhibitionAPI.getUpcomingExhibitions()
        ]);
        setCurrentExhibitions(ongoing);
        setUpcomingExhibitions(upcoming);
      } catch (err) {
        console.error('전시 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

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
        return <span className="inline-block px-3 py-1 bg-[#C84630] text-white text-xs rounded-full">전시 중</span>;
      case 'UPCOMING':
        return <span className="inline-block px-3 py-1 bg-amber-500 text-white text-xs rounded-full">전시 예정</span>;
      case 'PAST':
        return <span className="inline-block px-3 py-1 bg-gray-400 text-white text-xs rounded-full">지난 전시</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <section id="exhibitions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  const allExhibitions = [...currentExhibitions, ...upcomingExhibitions];
  
  // 카테고리별 필터링
  const filteredExhibitions = selectedCategory === 'all' 
    ? allExhibitions 
    : allExhibitions.filter(ex => ex.category === selectedCategory);

  return (
    <section id="exhibitions" className="min-h-screen bg-[#F4F4F0] py-16 flex flex-col justify-center relative">
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
        <div 
          ref={headerRef}
          className={`mb-8 fade-in-header ${isHeaderVisible ? 'visible' : ''}`}
        >
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
          <div className="flex gap-4 border-b border-[#2C2C2C]/20">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`pb-3 px-4 font-medium transition-all relative ${
                selectedCategory === 'all'
                  ? 'text-[#C84630]'
                  : 'text-[#2C2C2C]/60 hover:text-[#2C2C2C]'
              }`}
            >
              전체
              {selectedCategory === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
              )}
            </button>
            <button
              onClick={() => setSelectedCategory('memorial')}
              className={`pb-3 px-4 font-medium transition-all relative ${
                selectedCategory === 'memorial'
                  ? 'text-[#C84630]'
                  : 'text-[#2C2C2C]/60 hover:text-[#2C2C2C]'
              }`}
            >
              추모 전시
              {selectedCategory === 'memorial' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
              )}
            </button>
            <button
              onClick={() => setSelectedCategory('retrospective')}
              className={`pb-3 px-4 font-medium transition-all relative ${
                selectedCategory === 'retrospective'
                  ? 'text-[#C84630]'
                  : 'text-[#2C2C2C]/60 hover:text-[#2C2C2C]'
              }`}
            >
              회고전
              {selectedCategory === 'retrospective' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
              )}
            </button>
          </div>
        </div>

        {/* 카드 스크롤 영역 */}
        {isLoading ? (
          <div className="flex items-center justify-center text-[#2C2C2C]/60 py-20">
            로딩 중...
          </div>
        ) : filteredExhibitions.length === 0 ? (
          <div className="flex items-center justify-center text-[#2C2C2C]/60 py-20">
            {selectedCategory === 'all' 
              ? '현재 예정된 전시가 없습니다.'
              : selectedCategory === 'memorial'
              ? '추모 전시가 없습니다.'
              : '회고전이 없습니다.'}
          </div>
        ) : (
          <div 
            ref={cardsRef}
            className={`relative slide-in-cards ${isCardsVisible ? 'visible' : ''}`}
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
                touchAction: 'pan-x'
              }}
            >
              <div className="flex gap-8 pb-4">
                {filteredExhibitions.map((exhibition) => (
                  <div
                    key={exhibition.id}
                    onClick={() => navigate(`/exhibitions/${exhibition.id}`)}
                    className="flex-shrink-0 w-80 cursor-pointer group"
                  >
                    {/* 포스터 이미지 */}
                    <div className="relative overflow-hidden flex justify-center">
                      <ImageWithFallback
                        src={getImageUrl(exhibition.imageUrl)}
                        alt={exhibition.title}
                        className="w-[70%] aspect-[3/4] object-cover group-hover:opacity-90 transition-opacity duration-300"
                      />
                    </div>
                    
                    {/* 구분선 */}
                    <div className="w-full h-px bg-[#2C2C2C]/20 mb-4"></div>
                    
                    {/* 텍스트 정보 */}
                    <div className="flex flex-col min-h-[180px]">
                      {/* 지역 */}
                      <div className="text-xs text-[#2C2C2C]/60 font-medium mb-2">
                        {exhibition.location}
                      </div>
                      
                      {/* 제목 */}
                      <h3 className="text-xl font-bold text-[#2C2C2C] group-hover:text-[#C84630] transition-colors line-clamp-2 mb-3">
                        {exhibition.title}
                      </h3>
                      
                      {/* 설명 */}
                      <p className="text-sm text-[#2C2C2C]/70 leading-relaxed line-clamp-2 mb-4">
                        {exhibition.description}
                      </p>
                      
                      {/* 하단 고정 영역 */}
                      <div className="mt-auto space-y-3">
                        {/* 태그 */}
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-block px-3 py-1 bg-[#2C2C2C] text-[#F4F4F0] text-xs rounded-full">
                            {exhibition.artist}
                          </span>
                          {getStatusBadge(exhibition.status)}
                        </div>
                        
                        {/* 날짜 */}
                        <div className="flex items-center text-sm text-[#2C2C2C]/60">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 스크롤 가이드 바 */}
            {isScrollable && (
              <div className="mt-8 w-full max-w-md mx-auto">
                <div className="relative h-1 bg-[#2C2C2C]/20 rounded-full">
                <div 
                  className="absolute top-0 h-full bg-[#C84630] rounded-full"
                  style={{ 
                    left: `${scrollProgress}%`,
                    width: `${scrollBarWidth}%`,
                    transition: 'none'
                  }}
                />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
