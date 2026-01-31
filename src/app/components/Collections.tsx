import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { collectionAPI } from '@/utils/api';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Artwork {
  id: number;
  title: string;
  year: string;
  size: string;
  imageUrl: string;
  description: string;
  artist: string;
  isPinned: boolean;
}

export function Collections() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollBarWidth, setScrollBarWidth] = useState(20);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);
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
  }, [scrollContainerRef, artworks]);

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
  }, [artworks, isLoading]);

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
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const data = await collectionAPI.getAllCollections();
        // isPinned가 true인 항목만 필터링
        const pinnedArtworks = data.filter((artwork: Artwork) => artwork.isPinned);
        setArtworks(pinnedArtworks);
      } catch (err) {
        console.error('소장품 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // 이미지 URL 처리
  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${import.meta.env.VITE_API_BASE_URL || ''}${imageUrl}`;
  };

  if (isLoading) {
    return (
      <section id="collections" className="min-h-screen bg-[#2C2C2C] py-16 flex flex-col justify-center relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[#F4F4F0]/60">로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="collections" className="min-h-screen bg-[#2C2C2C] py-16 flex flex-col justify-center relative">
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
          className={`flex items-center justify-between mb-12 fade-in-header ${isHeaderVisible ? 'visible' : ''}`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[#F4F4F0] tracking-tight">대표 소장품</h2>
          <button 
            onClick={() => navigate('/collections')}
            className="flex items-center gap-2 text-[#F4F4F0] hover:text-[#C84630] transition-colors text-sm font-medium"
          >
            View More <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {artworks.length === 0 ? (
          <div className="flex items-center justify-center text-[#F4F4F0]/60 py-20">
            등록된 대표 소장품이 없습니다.
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
            >
              <div className="flex gap-8 pb-4">
                {artworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    onClick={() => navigate(`/collections/${artwork.id}`)}
                    className="flex-shrink-0 w-80 cursor-pointer group"
                  >
                    {/* 작품 이미지 */}
                    <div className="relative overflow-hidden flex justify-center h-[300px] items-end mb-0">
                      <ImageWithFallback
                        src={getImageUrl(artwork.imageUrl)}
                        alt={artwork.title}
                        className="w-[90%] max-h-full object-contain group-hover:opacity-90 transition-opacity duration-300"
                      />
                    </div>
                    
                    {/* 구분선 */}
                    <div className="w-full h-px bg-[#F4F4F0]/20 mb-4"></div>
                    
                    {/* 텍스트 정보 */}
                    <div className="flex flex-col min-h-[180px]">
                      {/* 작가 */}
                      <div className="text-xs text-[#F4F4F0]/60 font-medium mb-2">
                        {artwork.artist}
                      </div>
                      
                      {/* 제목 */}
                      <h3 className="text-xl font-bold text-[#F4F4F0] group-hover:text-[#C84630] transition-colors line-clamp-2 mb-3">
                        {artwork.title}
                      </h3>
                      
                      {/* 설명 */}
                      <p className="text-sm text-[#F4F4F0]/70 leading-relaxed line-clamp-2 mb-4">
                        {artwork.description}
                      </p>
                      
                      {/* 하단 고정 영역 */}
                      <div className="mt-auto space-y-2">
                        {/* 제작 연도 및 크기 */}
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-block px-3 py-1 bg-[#F4F4F0] text-[#2C2C2C] text-xs rounded-full">
                            {artwork.year}
                          </span>
                          <span className="inline-block px-3 py-1 bg-[#F4F4F0]/20 text-[#F4F4F0] text-xs rounded-full">
                            {artwork.size}
                          </span>
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
                <div className="relative h-1 bg-[#F4F4F0]/20 rounded-full">
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
