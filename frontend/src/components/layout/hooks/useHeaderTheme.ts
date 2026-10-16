import { useState, useEffect } from 'react';

export function useHeaderTheme(pathname: string) {
  // sessionStorage에서 이전 헤더 상태 불러오기
  const getInitialHeaderState = () => {
    const saved = sessionStorage.getItem('headerDarkBackground');
    return saved !== null ? saved === 'true' : false;
  };

  const [isDarkBackground, setIsDarkBackground] = useState(getInitialHeaderState);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // 배경색 감지 함수 (모든 페이지에서 사용)
  const detectBackgroundColor = () => {
    const headerBottom = 80;
    const centerY = headerBottom + 100;
    const element = document.elementFromPoint(window.innerWidth / 2, centerY);

    if (element && element.tagName !== 'HEADER' && !element.closest('header')) {
      let currentElement: HTMLElement | null = element as HTMLElement;
      let foundDarkBg = false;

      while (currentElement && currentElement !== document.body) {
        const bgColor = window.getComputedStyle(currentElement).backgroundColor;

        if (
          bgColor === 'rgb(44, 44, 44)' ||
          bgColor.includes('rgba(44, 44, 44') ||
          currentElement.classList.contains('bg-[#2C2C2C]')
        ) {
          foundDarkBg = true;
          break;
        }

        if (
          bgColor === 'rgb(244, 244, 240)' ||
          bgColor.includes('rgba(244, 244, 240') ||
          currentElement.classList.contains('bg-[#F4F4F0]')
        ) {
          foundDarkBg = false;
          break;
        }

        currentElement = currentElement.parentElement;
      }

      // 상태 업데이트 및 sessionStorage에 저장
      setIsDarkBackground(foundDarkBg);
      sessionStorage.setItem('headerDarkBackground', String(foundDarkBg));
    }
  };

  // 초기 배경색 감지
  useEffect(() => {
    const timer = setTimeout(() => {
      detectBackgroundColor();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // 페이지 변경 감지 및 배경색 감지 (애니메이션 없이 즉시 변경)
  useEffect(() => {
    if (pathname !== prevPathname) {
      setPrevPathname(pathname);

      // transition 비활성화
      setIsPageTransitioning(true);

      // DOM 렌더링 후 배경색 감지
      const timer = setTimeout(() => {
        detectBackgroundColor();

        // transition 다시 활성화 (스크롤 감지용)
        setTimeout(() => {
          setIsPageTransitioning(false);
        }, 30);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  // 스크롤 위치에 따른 배경색 감지 (홈페이지만 동적 감지)
  useEffect(() => {
    // 홈페이지가 아니면 스크롤 감지 비활성화
    if (pathname !== '/') return;

    const handleScroll = () => {
      detectBackgroundColor();
    };

    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', handleScroll);

    // 초기 감지
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return { isDarkBackground, isPageTransitioning };
}
