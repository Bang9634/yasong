import { useState, useEffect, useRef } from 'react';
import { Trophy, FileText, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import { websiteAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

interface ContestItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  status: 'ongoing' | 'ended';
  startDate?: string;
  endDate?: string;
  introLink: string;
  noticeLink: string;
}

export function Contest() {
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollBarWidth, setScrollBarWidth] = useState(20);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ongoing' | 'ended'>('all');
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
      
      const visibleRatio = clientWidth / scrollWidth;
      const indicatorWidth = Math.max(5, Math.min(visibleRatio * 100, 30));
      setScrollBarWidth(indicatorWidth);
      
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
  }, [scrollContainerRef, contests]);

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef) {
      const scrollAmount = 400;
      scrollContainerRef.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // 공모전 데이터 가져오기
  useEffect(() => {
    const fetchContestData = async () => {
      try {
        setIsLoading(true);
        
        const [titleData, subtitleData, contentData, imageData, activeData, introLinkData, noticeLinkData] = await Promise.all([
          websiteAPI.getTextSetting('contest_title'),
          websiteAPI.getTextSetting('contest_subtitle'),
          websiteAPI.getTextSetting('contest_content'),
          websiteAPI.getImage('contest_poster'),
          websiteAPI.getTextSetting('contest_active'),
          websiteAPI.getTextSetting('contest_intro_link'),
          websiteAPI.getTextSetting('contest_notice_link'),
        ]);
        
        // 이미지 URL 처리
        let imageUrl = '';
        if (imageData.imageUrl) {
          imageUrl = imageData.imageUrl.startsWith('http')
            ? imageData.imageUrl
            : `${import.meta.env.VITE_API_BASE_URL || ''}${imageData.imageUrl}`;
        }

        // 단일 공모전 데이터를 배열로 변환
        const contestItem: ContestItem = {
          id: '1',
          title: titleData?.value || '야송배 대한민국 청소년 그림그리기 대회',
          subtitle: subtitleData?.value || 'Yasong Cup National Youth Drawing Contest',
          content: contentData?.value || '야송 권재행 화백의 예술정신을 계승하고 청소년 문화예술 발전에 기여하기 위한 청소년 그림그리기 대회입니다.',
          imageUrl: imageUrl,
          status: activeData?.value === 'true' ? 'ongoing' : 'ended',
          introLink: introLinkData?.value || '',
          noticeLink: noticeLinkData?.value || ''
        };

        setContests([contestItem]);
      } catch (err) {
        console.error('공모전 데이터 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestData();
  }, []);

  const filteredContests = contests.filter(contest => {
    if (selectedCategory === 'all') return true;
    return contest.status === selectedCategory;
  });

  if (isLoading || contests.length === 0) {
    return null;
  }

  return (
    <section id="contest" className="min-h-screen bg-[#2C2C2C] py-16 flex flex-col justify-center relative">
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
              onClick={() => setSelectedCategory('ended')}
              className={`pb-3 px-4 font-medium transition-all relative ${
                selectedCategory === 'ended'
                  ? 'text-[#C84630]'
                  : 'text-[#F4F4F0]/60 hover:text-[#F4F4F0]'
              }`}
            >
              종료
              {selectedCategory === 'ended' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
              )}
            </button>
          </div>
        </div>

        {/* 카드 스크롤 영역 */}
        {isLoading ? (
          <div className="flex items-center justify-center text-[#F4F4F0]/60 py-20">
            로딩 중...
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="flex items-center justify-center text-[#F4F4F0]/60 py-20">
            {selectedCategory === 'all' 
              ? '현재 예정된 공모전이 없습니다.'
              : selectedCategory === 'ongoing'
              ? '진행 중인 공모전이 없습니다.'
              : '종료된 공모전이 없습니다.'}
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
              style={{ 
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x'
              }}
            >
              <div className="flex gap-8 pb-4">
                {filteredContests.map((contest) => (
                  <div
                    key={contest.id}
                    onClick={() => navigate(`/contests/${contest.id}`)}
                    className="flex-shrink-0 w-80 cursor-pointer group"
                  >
                    {/* 포스터 이미지 */}
                    <div className="relative overflow-hidden flex justify-center">
                      <img
                        src={contest.imageUrl}
                        alt={contest.title}
                        className="w-[70%] aspect-[3/4] object-cover group-hover:opacity-90 transition-opacity duration-300"
                      />
                    </div>
                    
                    {/* 구분선 */}
                    <div className="w-full h-px bg-[#F4F4F0]/20 mb-4"></div>
                    
                    {/* 텍스트 정보 */}
                    <div className="flex flex-col min-h-[180px]">
                      {/* 부제목 */}
                      <div className="text-xs text-[#F4F4F0]/60 font-medium mb-2">
                        {contest.subtitle}
                      </div>
                      
                      {/* 제목 */}
                      <h3 className="text-xl font-bold text-[#F4F4F0] group-hover:text-[#C84630] transition-colors line-clamp-2 mb-3">
                        {contest.title}
                      </h3>
                      
                      {/* 설명 */}
                      <p className="text-sm text-[#F4F4F0]/70 leading-relaxed line-clamp-2 mb-4">
                        {contest.content}
                      </p>
                      
                      {/* 하단 고정 영역 */}
                      <div className="mt-auto space-y-3">
                        {/* 태그 */}
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                            contest.status === 'ongoing'
                              ? 'bg-[#C84630] text-[#F4F4F0]'
                              : 'bg-[#F4F4F0] text-[#2C2C2C]'
                          }`}>
                            {contest.status === 'ongoing' ? '진행 중' : '종료'}
                          </span>
                        </div>
                        
                        {/* 날짜 */}
                        {contest.startDate && contest.endDate && (
                          <div className="flex items-center text-sm text-[#F4F4F0]/60">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{contest.startDate} - {contest.endDate}</span>
                          </div>
                        )}
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
