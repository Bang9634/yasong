import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove, isAdmin } from '@/utils/auth';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isNoticeDropdownOpen, setIsNoticeDropdownOpen] = useState(false);
  const [isExhibitionDropdownOpen, setIsExhibitionDropdownOpen] = useState(false);
  const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] = useState(false);
  const [isSouvenirDropdownOpen, setIsSouvenirDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, logout } = useAuth();

  // 페이지별 예상 배경색 설정 (깜빡임 방지)
  const getInitialBackground = (pathname: string) => {
    // 어두운 배경 페이지들
    if (pathname.startsWith('/collections')) return true;
    // 밝은 배경 페이지들
    if (pathname.startsWith('/notice') || pathname.startsWith('/exhibitions')) return false;
    // 홈페이지는 스크롤 위치에 따라 달라지므로 false (기본값)
    return false;
  };

  const [isDarkBackground, setIsDarkBackground] = useState(() => getInitialBackground(location.pathname));
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  // 페이지 변경 감지 및 예상 배경색으로 전환
  useEffect(() => {
    if (location.pathname !== prevPathname) {
      setPrevPathname(location.pathname);
      const newBackground = getInitialBackground(location.pathname);
      
      // 상태가 실제로 변경될 때만 업데이트 (transition 발생)
      if (newBackground !== isDarkBackground) {
        setIsDarkBackground(newBackground);
      }
    }
  }, [location.pathname, prevPathname, isDarkBackground]);

  // 스크롤 위치에 따른 배경색 감지
  useEffect(() => {
    const handleScroll = () => {
      // 헤더 하단의 중앙 지점 - 좀 더 아래쪽으로 조정
      const headerBottom = 80; // 헤더 높이
      const centerY = headerBottom + 100; // 180px 지점 (더 아래로)
      
      // 해당 위치의 요소 가져오기
      const element = document.elementFromPoint(window.innerWidth / 2, centerY);
      
      if (element) {
        // 현재 요소와 부모 요소들의 배경색 확인
        let currentElement: HTMLElement | null = element as HTMLElement;
        let foundDarkBg = false;
        
        // 헤더 자신은 건너뛰기
        if (currentElement.tagName === 'HEADER' || currentElement.closest('header')) {
          return;
        }
        
        while (currentElement && currentElement !== document.body) {
          const bgColor = window.getComputedStyle(currentElement).backgroundColor;
          
          // rgb(44, 44, 44) = #2C2C2C (먹색/어두운 배경)
          if (bgColor === 'rgb(44, 44, 44)' || 
              bgColor.includes('rgba(44, 44, 44') ||
              currentElement.classList.contains('bg-[#2C2C2C]')) {
            foundDarkBg = true;
            break;
          }
          
          // rgb(244, 244, 240) = #F4F4F0 (한지 화이트/밝은 배경)
          // 밝은 배경이면 헤더를 어둡게 해야 하므로 foundDarkBg = false
          if (bgColor === 'rgb(244, 244, 240)' || 
              bgColor.includes('rgba(244, 244, 240') ||
              currentElement.classList.contains('bg-[#F4F4F0]')) {
            foundDarkBg = false;
            break;
          }
          
          currentElement = currentElement.parentElement;
        }
        
        setIsDarkBackground(foundDarkBg);
      }
    };

    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', handleScroll);
    
    // 초기 감지
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 페이지 변경 시 배경색 재감지
  useEffect(() => {
    // pathname이 변경될 때만 실행
    if (location.pathname === prevPathname) return;
    
    // DOM 렌더링 후 재감지 (홈페이지의 경우 스크롤 위치 고려)
    const timer = setTimeout(() => {
      const headerBottom = 80;
      const centerY = headerBottom + 100;
      const element = document.elementFromPoint(window.innerWidth / 2, centerY);
      
      if (element && element.tagName !== 'HEADER' && !element.closest('header')) {
        let currentElement: HTMLElement | null = element as HTMLElement;
        let foundDarkBg = false;
        
        while (currentElement && currentElement !== document.body) {
          const bgColor = window.getComputedStyle(currentElement).backgroundColor;
          
          if (bgColor === 'rgb(44, 44, 44)' || bgColor.includes('rgba(44, 44, 44') || currentElement.classList.contains('bg-[#2C2C2C]')) {
            foundDarkBg = true;
            break;
          }
          
          if (bgColor === 'rgb(244, 244, 240)' || bgColor.includes('rgba(244, 244, 240') || currentElement.classList.contains('bg-[#F4F4F0]')) {
            foundDarkBg = false;
            break;
          }
          
          currentElement = currentElement.parentElement;
        }
        
        // 홈페이지에서만 감지 값으로 업데이트 (다른 페이지는 예상값 유지)
        if (location.pathname === '/') {
          setIsDarkBackground(foundDarkBg);
        }
      }
    }, 200);
    
    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname, prevPathname]);

  const handleLogout = () => {
    logout();
    alert('로그아웃되었습니다.');
    navigate('/');
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      // 홈페이지가 아니면 홈으로 이동 후 스크롤
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // 홈페이지면 바로 스크롤
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
    setIsAboutDropdownOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
      isDarkBackground 
        ? 'bg-[#F4F4F0]/98' 
        : 'bg-[#2C2C2C]/98'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 py-4">
          {/* 로고 */}
          <div className="cursor-pointer flex items-center gap-3 flex-shrink-0" onClick={() => scrollToSection('hero')}>
            <img 
              src="/yasong-icon.png" 
              alt="야송미술관 로고" 
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-bold tracking-wider transition-colors duration-300 ${
                isDarkBackground ? 'text-[#2C2C2C]' : 'text-[#F4F4F0]'
              }`}>
                YASONG
              </h1>
            </div>
          </div>

          {/* 데스크톱 네비게이션 - 중앙 정렬 */}
          <nav className="hidden lg:flex space-x-10 absolute left-1/2 -translate-x-1/2">
            {/* 야송 이야기 드롭다운 */}
            <div className="relative group">
              <button
                className={`transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
                  isDarkBackground 
                    ? 'text-[#2C2C2C] hover:text-[#C84630]' 
                    : 'text-[#F4F4F0] hover:text-[#C84630]'
                }`}
              >
                야송 이야기
              </button>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 shadow-lg border rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${
                  isDarkBackground 
                    ? 'bg-[#F4F4F0] border-[#E0E0E0]' 
                    : 'bg-[#2C2C2C] border-[#404040]'
                }`}
              >
                <button
                  onClick={() => scrollToSection('director')}
                  className={`block w-full text-left px-4 py-2.5 transition-all ${
                    isDarkBackground
                      ? 'text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630]'
                      : 'text-[#F4F4F0] hover:bg-[#C84630]/20 hover:text-[#C84630]'
                  }`}
                >
                  약력
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // TODO: 일대기 페이지 구현 후 navigate 추가
                  }}
                  className={`block w-full text-left px-4 py-2.5 transition-all ${
                    isDarkBackground
                      ? 'text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630]'
                      : 'text-[#F4F4F0] hover:bg-[#C84630]/20 hover:text-[#C84630]'
                  }`}
                >
                  일대기
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // TODO: 화업의 평가 페이지 구현 후 navigate 추가
                  }}
                  className={`block w-full text-left px-4 py-2.5 transition-all ${
                    isDarkBackground
                      ? 'text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630]'
                      : 'text-[#F4F4F0] hover:bg-[#C84630]/20 hover:text-[#C84630]'
                  }`}
                >
                  화업의 평가, 평론
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // TODO: 사진 자료 페이지 구현 후 navigate 추가
                  }}
                  className={`block w-full text-left px-4 py-2.5 transition-all ${
                    isDarkBackground
                      ? 'text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630]'
                      : 'text-[#F4F4F0] hover:bg-[#C84630]/20 hover:text-[#C84630]'
                  }`}
                >
                  사진 자료
                </button>
              </div>
            </div>

            {/* 작품 소개 */}
            <button
              onClick={() => { navigate('/collections'); }}
              className={`transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
                isDarkBackground 
                  ? 'text-[#2C2C2C] hover:text-[#C84630]' 
                  : 'text-[#F4F4F0] hover:text-[#C84630]'
              }`}
            >
              작품 소개
            </button>

            {/* 전시 드롭다운 */}
            <div className="relative group">
              <button
                onClick={() => { navigate('/exhibitions'); }}
                className={`transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
                  isDarkBackground 
                    ? 'text-[#2C2C2C] hover:text-[#C84630]' 
                    : 'text-[#F4F4F0] hover:text-[#C84630]'
                }`}
              >
                전시
              </button>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 shadow-lg border rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${
                  isDarkBackground 
                    ? 'bg-[#F4F4F0] border-[#E0E0E0]' 
                    : 'bg-[#2C2C2C] border-[#404040]'
                }`}
              >
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/exhibitions');
                  }}
                  className={`block w-full text-left px-4 py-2.5 transition-all ${
                    isDarkBackground
                      ? 'text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630]'
                      : 'text-[#F4F4F0] hover:bg-[#C84630]/20 hover:text-[#C84630]'
                  }`}
                >
                  추모 전시, 회고전
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // TODO: 언론 보도 페이지 구현 후 navigate 추가
                  }}
                  className={`block w-full text-left px-4 py-2.5 transition-all ${
                    isDarkBackground
                      ? 'text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630]'
                      : 'text-[#F4F4F0] hover:bg-[#C84630]/20 hover:text-[#C84630]'
                  }`}
                >
                  언론 보도, SNS 소개
                </button>
              </div>
            </div>

            {/* 공모전 */}
            <button
              onClick={() => scrollToSection('contest')}
              className={`transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
                isDarkBackground 
                  ? 'text-[#2C2C2C] hover:text-[#C84630]' 
                  : 'text-[#F4F4F0] hover:text-[#C84630]'
              }`}
            >
              공모전
            </button>

            {/* 공지사항 */}
            <button
              onClick={() => {
                navigate('/notice');
                setIsMenuOpen(false);
              }}
              className={`transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
                isDarkBackground 
                  ? 'text-[#2C2C2C] hover:text-[#C84630]' 
                  : 'text-[#F4F4F0] hover:text-[#C84630]'
              }`}
            >
              공지사항
            </button>
          </nav>

          {/* 오른쪽 영역 - 관리자 메뉴 및 모바일 버튼 */}
          <div className="flex items-center gap-4 ml-auto">
            {/* 관리자 로그인 버튼들 (데스크톱) */}
            {user && (
              <div className="hidden lg:flex items-center gap-4">
                {/* 관리자 메뉴 (MANAGER, ADMIN) */}
                {isManagerOrAbove(user.role) && (
                  <div className="relative group">
                    <button className={`transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
                      isDarkBackground 
                        ? 'text-[#2C2C2C] hover:text-[#C84630]' 
                        : 'text-[#F4F4F0] hover:text-[#C84630]'
                    }`}>
                      관리
                    </button>
                    <div className={`absolute top-full right-0 mt-3 w-44 shadow-lg border rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${
                        isDarkBackground 
                          ? 'bg-[#F4F4F0] border-[#E0E0E0]' 
                          : 'bg-[#2C2C2C] border-[#404040]'
                      }`}>
                      {isAdmin(user.role) && (
                        <button
                          onClick={() => {
                            navigate('/admin/users');
                            setIsMenuOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2.5 transition-all ${
                            isDarkBackground
                              ? 'text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630]'
                              : 'text-[#F4F4F0] hover:bg-[#C84630]/20 hover:text-[#C84630]'
                          }`}
                        >
                          사용자 관리
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigate('/admin/website');
                          setIsMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2.5 transition-all ${
                          isDarkBackground
                            ? 'text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630]'
                            : 'text-[#F4F4F0] hover:bg-[#C84630]/20 hover:text-[#C84630]'
                        }`}
                      >
                        홈페이지 관리
                      </button>
                      {isAdmin(user.role) && (
                        <button
                          onClick={() => {
                            navigate('/admin/analytics');
                            setIsMenuOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2.5 transition-all ${
                            isDarkBackground
                              ? 'text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630]'
                              : 'text-[#F4F4F0] hover:bg-[#C84630]/20 hover:text-[#C84630]'
                          }`}
                        >
                          통계
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/profile')}
                  className={`transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
                    isDarkBackground 
                      ? 'text-[#2C2C2C] hover:text-[#C84630]' 
                      : 'text-[#F4F4F0] hover:text-[#C84630]'
                  }`}
                >
                  내정보
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-[#C84630] text-white hover:bg-[#A83820] transition-colors"
                >
                  로그아웃
                </button>
              </div>
            )}

            {/* 모바일 메뉴 버튼 */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={`w-6 h-6 transition-colors ${isDarkBackground ? 'text-[#2C2C2C]' : 'text-[#F4F4F0]'}`} />
              ) : (
                <Menu className={`w-6 h-6 transition-colors ${isDarkBackground ? 'text-[#2C2C2C]' : 'text-[#F4F4F0]'}`} />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-6 space-y-0.5 max-h-[calc(100vh-80px)] overflow-y-auto">
            {/* 야송 이야기 */}
            <button
              onClick={() => {
                scrollToSection('director');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-medium transition-colors ${
                isDarkBackground 
                  ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                  : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
              }`}
            >
              야송 이야기
            </button>
            {/* 야송 이야기 하위 메뉴 */}
            <div className={`py-1 ${
              isDarkBackground ? 'bg-[#2C2C2C]/3' : 'bg-[#F4F4F0]/3'
            }`}>
              <button
                onClick={() => {
                  scrollToSection('director');
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-10 py-2 text-sm transition-colors ${
                  isDarkBackground 
                    ? 'text-[#2C2C2C]/80 hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                    : 'text-[#F4F4F0]/80 hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                }`}
              >
                • 약력
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: 일대기 페이지 구현 후 navigate 추가
                }}
                className={`block w-full text-left px-10 py-2 text-sm transition-colors ${
                  isDarkBackground 
                    ? 'text-[#2C2C2C]/80 hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                    : 'text-[#F4F4F0]/80 hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                }`}
              >
                • 일대기
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: 화업의 평가 페이지 구현 후 navigate 추가
                }}
                className={`block w-full text-left px-10 py-2 text-sm transition-colors ${
                  isDarkBackground 
                    ? 'text-[#2C2C2C]/80 hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                    : 'text-[#F4F4F0]/80 hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                }`}
              >
                • 화업의 평가, 평론
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: 사진 자료 페이지 구현 후 navigate 추가
                }}
                className={`block w-full text-left px-10 py-2 text-sm transition-colors ${
                  isDarkBackground 
                    ? 'text-[#2C2C2C]/80 hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                    : 'text-[#F4F4F0]/80 hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                }`}
              >
                • 사진 자료
              </button>
            </div>
            
            {/* 작품 소개 */}
            <button
              onClick={() => {
                navigate('/collections');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-medium transition-colors ${
                isDarkBackground 
                  ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                  : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
              }`}
            >
              작품 소개
            </button>
            
            {/* 전시 */}
            <button
              onClick={() => {
                navigate('/exhibitions');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-medium transition-colors ${
                isDarkBackground 
                  ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                  : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
              }`}
            >
              전시
            </button>
            {/* 전시 하위 메뉴 */}
            <div className={`py-1 ${
              isDarkBackground ? 'bg-[#2C2C2C]/3' : 'bg-[#F4F4F0]/3'
            }`}>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/exhibitions');
                }}
                className={`block w-full text-left px-10 py-2 text-sm transition-colors ${
                  isDarkBackground 
                    ? 'text-[#2C2C2C]/80 hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                    : 'text-[#F4F4F0]/80 hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                }`}
              >
                • 추모 전시, 회고전
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: 언론 보도 페이지 구현 후 navigate 추가
                }}
                className={`block w-full text-left px-10 py-2 text-sm transition-colors ${
                  isDarkBackground 
                    ? 'text-[#2C2C2C]/80 hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                    : 'text-[#F4F4F0]/80 hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                }`}
              >
                • 언론 보도, SNS 소개
              </button>
            </div>
            
            {/* 공모전 */}
            <button
              onClick={() => {
                scrollToSection('contest');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-medium transition-colors ${
                isDarkBackground 
                  ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                  : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
              }`}
            >
              공모전
            </button>
            
            {/* 공지사항 */}
            <button
              onClick={() => {
                navigate('/notice');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-medium transition-colors ${
                isDarkBackground 
                  ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                  : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
              }`}
            >
              공지사항
            </button>
            
            {/* 로그인 상태에 따른 버튼 */}
            <div className={`border-t pt-4 mt-4 space-y-2 ${
              isDarkBackground ? 'border-[#2C2C2C]/20' : 'border-[#F4F4F0]/20'
            }`}>
              {user && (
                <>
                  {/* 관리자 메뉴 (모바일) */}
                  {isManagerOrAbove(user.role) && (
                    <div className={`border-b pb-3 mb-3 ${
                      isDarkBackground ? 'border-[#2C2C2C]/20' : 'border-[#F4F4F0]/20'
                    }`}>
                      <div className="px-4 py-2 text-sm text-[#C84630] font-bold">관리</div>
                      {isAdmin(user.role) && (
                        <button
                          onClick={() => {
                            navigate('/admin/users');
                            setIsMenuOpen(false);
                          }}
                          className={`block w-full text-left px-8 py-2 transition-colors ${
                            isDarkBackground 
                              ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                              : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                          }`}
                        >
                          사용자 관리
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigate('/admin/website');
                          setIsMenuOpen(false);
                        }}
                        className={`block w-full text-left px-8 py-2 transition-colors ${
                          isDarkBackground 
                            ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                            : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                        }`}
                      >
                        홈페이지 관리
                      </button>
                      {isAdmin(user.role) && (
                        <button
                          onClick={() => {
                            navigate('/admin/analytics');
                            setIsMenuOpen(false);
                          }}
                          className={`block w-full text-left px-8 py-2 transition-colors ${
                            isDarkBackground 
                              ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                              : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                          }`}
                        >
                          통계
                        </button>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 transition-colors ${
                      isDarkBackground 
                        ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                        : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                    }`}
                  >
                    내정보
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-3 transition-colors ${
                      isDarkBackground 
                        ? 'bg-[#C84630] text-[#F4F4F0] hover:bg-[#A83820]'
                        : 'bg-[#C84630] text-[#F4F4F0] hover:bg-[#A83820]'
                    }`}
                  >
                    로그아웃
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
