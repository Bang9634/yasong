import { useState, useEffect } from 'react';

export function useHorizontalScroll(content: unknown) {
  const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollBarWidth, setScrollBarWidth] = useState(20);

  // 스크롤 위치 확인
  const checkScroll = () => {
    if (scrollContainerRef) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef;
      const canScroll = scrollWidth > clientWidth;
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
  }, [scrollContainerRef, content]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef) {
      const scrollAmount = 400;
      scrollContainerRef.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return {
    setScrollContainerRef,
    showLeftArrow,
    showRightArrow,
    scrollProgress,
    scrollBarWidth,
    scroll,
  };
}
