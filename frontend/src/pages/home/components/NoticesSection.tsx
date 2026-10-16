import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { noticeAPI } from '@/utils/api';

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  viewCount: number;
  status: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export function NoticesSection() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    setScrollContainerRef,
    showLeftArrow,
    showRightArrow,
    scrollProgress,
    scrollBarWidth,
    scroll,
  } = useHorizontalScroll(notices);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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
  }, [notices, isLoading]);

  // 공지사항 데이터 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        // 페이지네이션 파라미터와 함께 API 호출
        const response = await noticeAPI.getNotices({
          page: 1,
          limit: 6, // 최대 5개만 표시
        });

        // 고정 글 우선, 그 다음 최신순
        const noticesArray = Array.isArray(response.content) ? response.content : [];
        const sortedData = noticesArray.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setNotices(sortedData);
      } catch (err) {
        console.error('공지사항 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // 카테고리 한글 변환
  const getCategoryKorean = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      GENERAL: '일반',
      EXHIBITION: '전시',
      CONTEST: '공모전',
      MAINTENANCE: '시스템',
    };
    return categoryMap[category] || category;
  };

  return (
    <section id="notice" className="min-h-screen bg-[#F4F4F0] pt-32 pb-16 flex flex-col relative">
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
          <h2 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] tracking-tight">공지사항</h2>
          <button
            onClick={() => navigate('/notice')}
            className="flex items-center gap-2 text-[#2C2C2C] hover:text-[#C84630] transition-colors text-sm font-medium"
          >
            View More <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 카드 스크롤 영역 */}
        {isLoading ? (
          <div className="flex items-center justify-center text-[#2C2C2C]/60 h-[500px]">
            로딩 중...
          </div>
        ) : notices.length === 0 ? (
          <div className="flex items-center justify-center text-[#2C2C2C]/60 h-[500px]">
            등록된 공지사항이 없습니다.
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
              <div className="flex gap-6 pb-4">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    onClick={() => navigate(`/notice/${notice.id}`)}
                    className="flex-shrink-0 w-80 h-[400px] cursor-pointer group relative"
                  >
                    {/* 화이트 배경 카드 */}
                    <div className="h-full flex flex-col p-6 bg-white rounded-lg hover:shadow-lg transition-shadow border border-[#2C2C2C]/10">
                      {/* 카테고리 태그 + 고정 태그 */}
                      <div className="flex gap-2 mb-4">
                        <span className="inline-block px-3 py-1 bg-[#2C2C2C] text-[#F4F4F0] text-xs font-bold rounded">
                          {getCategoryKorean(notice.category) || '공지'}
                        </span>
                        {notice.isPinned && (
                          <span className="inline-block px-3 py-1 bg-[#C84630] text-white text-xs font-bold rounded">
                            고정
                          </span>
                        )}
                      </div>

                      {/* 제목 */}
                      <h3 className="text-xl font-bold text-[#2C2C2C] mb-3 line-clamp-2 group-hover:text-[#C84630] transition-colors">
                        {notice.title}
                      </h3>

                      {/* 내용 미리보기 - flex-1로 남은 공간 차지 */}
                      <p className="text-[#2C2C2C]/70 text-sm leading-relaxed line-clamp-6 mb-4 flex-1">
                        {notice.content
                          ? notice.content.substring(0, 140) +
                            (notice.content.length > 140 ? '...' : '')
                          : '내용이 없습니다.'}
                      </p>

                      {/* 날짜 */}
                      <p className="text-[#2C2C2C]/50 text-xs">
                        {new Date(notice.createdAt)
                          .toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                          .replace(/\. /g, '-')
                          .replace('.', '')}
                      </p>
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
