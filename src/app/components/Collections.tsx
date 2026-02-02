import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { collectionAPI } from '@/utils/api';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
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
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 스크롤 위치 확인
  const checkScroll = () => {
    if (scrollContainerRef) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef;
      const canScroll = scrollWidth > clientWidth;
      setIsScrollable(canScroll);
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      
      // 스크롤 바 인디케이터 너비 계산 (보이는 영역 비율)
      if (!canScroll) {
        // 스크롤할 수 없으면 전체가 빨간색 (100%)
        setScrollBarWidth(100);
        setScrollProgress(0);
      } else {
        // 스크롤 가능하면 보이는 영역 비율만큼 표시
        const visibleRatio = clientWidth / scrollWidth;
        const indicatorWidth = Math.max(10, visibleRatio * 100); // 최소 10%
        setScrollBarWidth(indicatorWidth);
        
        // 스크롤 진행률 계산 (인디케이터가 범위를 벗어나지 않도록)
        const maxScroll = scrollWidth - clientWidth;
        const progress = (scrollLeft / maxScroll) * (100 - indicatorWidth);
        setScrollProgress(progress);
      }
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
        const response = await collectionAPI.getAllCollections();
        
        // Spring Page 형식 처리 (content) 또는 일반 배열
        const data = response.content || response.data || response;
        
        // isPinned가 true인 항목만 필터링
        const pinnedArtworks = Array.isArray(data) 
          ? data.filter((artwork: Artwork) => artwork.isPinned)
          : [];
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
      <section id="collections" className="h-screen bg-[#2C2C2C] pt-32 pb-16 flex flex-col relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[#F4F4F0]/60">로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="collections" className="h-screen bg-[#2C2C2C] pt-32 pb-16 flex flex-col relative">
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
          <h2 className="text-4xl sm:text-5xl font-bold text-[#F4F4F0] tracking-tight">대표 작품</h2>
          <button 
            onClick={() => navigate('/collections')}
            className="flex items-center gap-2 text-[#F4F4F0] hover:text-[#C84630] transition-colors text-sm font-medium"
          >
            View More <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {artworks.length === 0 ? (
          <div className="flex items-center justify-center text-[#F4F4F0]/60 h-[400px]">
            등록된 대표 작품이 없습니다.
          </div>
        ) : (
          <div 
            ref={cardsRef}
            className={`relative slide-in-cards ${isCardsVisible ? 'visible' : ''} h-[400px]`}
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
                touchAction: 'pan-x'
              }}
            >
              <div className="flex gap-8 pb-4">
                {artworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    onClick={() => setSelectedArtwork(artwork)}
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
                      <p className="text-sm text-[#F4F4F0]/70 leading-relaxed line-clamp-3 mb-4">
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
          </div>
        )}
      </div>

      {/* 작품 상세보기 모달 */}
      {selectedArtwork && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedArtwork(null)}
        >
          <div 
            className="relative bg-[#2C2C2C] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#F4F4F0] hover:bg-[#C84630] text-[#2C2C2C] hover:text-[#F4F4F0] rounded-full flex items-center justify-center transition-colors"
              aria-label="닫기"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* 왼쪽: 이미지 */}
              <div className="flex items-center justify-center p-8">
                <ImageWithFallback
                  src={getImageUrl(selectedArtwork.imageUrl)}
                  alt={selectedArtwork.title}
                  className="w-full h-auto max-h-[600px] object-contain"
                />
              </div>

              {/* 오른쪽: 정보 */}
              <div className="flex flex-col justify-center space-y-6">
                {/* 작가 */}
                <div>
                  <span className="inline-block px-4 py-2 bg-[#F4F4F0] text-[#2C2C2C] text-sm font-medium rounded-full">
                    {selectedArtwork.artist}
                  </span>
                </div>

                {/* 제목 */}
                <h2 className="text-4xl font-bold text-[#F4F4F0]">
                  {selectedArtwork.title}
                </h2>

                {/* 구분선 */}
                <div className="w-20 h-1 bg-[#C84630]"></div>

                {/* 제작 정보 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[#F4F4F0]/60 text-sm font-medium w-20">제작년도</span>
                    <span className="text-[#F4F4F0] text-lg">{selectedArtwork.year}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#F4F4F0]/60 text-sm font-medium w-20">크기</span>
                    <span className="text-[#F4F4F0] text-lg">{selectedArtwork.size}</span>
                  </div>
                </div>

                {/* 설명 */}
                {selectedArtwork.description && (
                  <div className="pt-4">
                    <p className="text-[#F4F4F0]/90 leading-relaxed whitespace-pre-wrap">
                      {selectedArtwork.description}
                    </p>
                  </div>
                )}

                {/* 더보기 버튼 */}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSelectedArtwork(null);
                      navigate(`/collections/${selectedArtwork.id}`);
                    }}
                    className="px-6 py-3 bg-[#F4F4F0] text-[#2C2C2C] rounded-lg hover:bg-[#C84630] hover:text-[#F4F4F0] transition-colors font-medium"
                  >
                    상세 페이지로 이동
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
