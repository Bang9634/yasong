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

  // sessionStorage에서 이전 헤더 상태 불러오기
  const getInitialHeaderState = () => {
    const saved = sessionStorage.getItem('headerDarkBackground');
    return saved !== null ? saved === 'true' : false;
  };

  const [isDarkBackground, setIsDarkBackground] = useState(getInitialHeaderState);
  const [prevPathname, setPrevPathname] = useState(location.pathname);
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
        
        if (bgColor === 'rgb(44, 44, 44)' || 
            bgColor.includes('rgba(44, 44, 44') ||
            currentElement.classList.contains('bg-[#2C2C2C]')) {
          foundDarkBg = true;
          break;
        }
        
        if (bgColor === 'rgb(244, 244, 240)' || 
            bgColor.includes('rgba(244, 244, 240') ||
            currentElement.classList.contains('bg-[#F4F4F0]')) {
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
    if (location.pathname !== prevPathname) {
      setPrevPathname(location.pathname);
      
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
  }, [location.pathname, prevPathname]);

  // 스크롤 위치에 따른 배경색 감지 (홈페이지만 동적 감지)
  useEffect(() => {
    // 홈페이지가 아니면 스크롤 감지 비활성화
    if (location.pathname !== '/') return;

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
  }, [location.pathname]);

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
    <header className={`fixed top-0 left-0 right-0 z-50 ${
      isPageTransitioning ? 'transition-none' : 'transition-colors duration-700'
    } ${
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
              alt="야송 로고" 
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-bold tracking-wider transition-colors duration-700 ${
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
                onClick={() => navigate('/story')}
                className={`transition-colors duration-700 py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
                  isDarkBackground 
                    ? 'text-[#2C2C2C] hover:text-[#C84630]' 
                    : 'text-[#F4F4F0] hover:text-[#C84630]'
                }`}
              >
                야송 이야기
              </button>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 shadow-lg border rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 z-50 ${
                  isDarkBackground 
                    ? 'bg-[#F4F4F0] border-[#E0E0E0]' 
                    : 'bg-[#2C2C2C] border-[#404040]'
                }`}
              >
                <button
                  onClick={() => navigate('/biography')}
                  className={`block w-full text-left px-4 py-2.5 transition-all duration-700 ${
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
                    navigate('/');
                    // TODO: 일대기 페이지 구현 후 navigate 추가
                  }}
                  className={`block w-full text-left px-4 py-2.5 transition-all duration-700 ${
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
                  className={`block w-full text-left px-4 py-2.5 transition-all duration-700 ${
                    isDarkBackground
                      ? 'text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630]'
                      : 'text-[#F4F4F0] hover:bg-[#C84630]/20 hover:text-[#C84630]'
                  }`}
                >
                  화업의 평가, 평론
                </button>
                <button
                  onClick={() => {
                    navigate('/photos');
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 transition-all duration-700 ${
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
              className={`transition-colors duration-700 py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
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
                className={`transition-colors duration-700 py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
                  isDarkBackground 
                    ? 'text-[#2C2C2C] hover:text-[#C84630]' 
                    : 'text-[#F4F4F0] hover:text-[#C84630]'
                }`}
              >
                전시
              </button>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 shadow-lg border rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 z-50 ${
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
                  className={`block w-full text-left px-4 py-2.5 transition-all duration-700 ${
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
                  className={`block w-full text-left px-4 py-2.5 transition-all duration-700 ${
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
              onClick={() => navigate('/contests')}
              className={`transition-colors duration-700 py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
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
              className={`transition-colors duration-700 py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
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
                    <button className={`transition-colors duration-700 py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
                      isDarkBackground 
                        ? 'text-[#2C2C2C] hover:text-[#C84630]' 
                        : 'text-[#F4F4F0] hover:text-[#C84630]'
                    }`}>
                      관리
                    </button>
                    <div className={`absolute top-full right-0 mt-3 w-44 shadow-lg border rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 z-50 ${
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
                          className={`block w-full text-left px-4 py-2.5 transition-all duration-700 ${
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
                        className={`block w-full text-left px-4 py-2.5 transition-all duration-700 ${
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
                          className={`block w-full text-left px-4 py-2.5 transition-all duration-700 ${
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
                  className={`transition-colors duration-700 py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
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
                <X className={`w-6 h-6 transition-colors duration-700 ${isDarkBackground ? 'text-[#2C2C2C]' : 'text-[#F4F4F0]'}`} />
              ) : (
                <Menu className={`w-6 h-6 transition-colors duration-700 ${isDarkBackground ? 'text-[#2C2C2C]' : 'text-[#F4F4F0]'}`} />
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
                navigate('/story');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-medium transition-colors duration-700 ${
                isDarkBackground 
                  ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                  : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
              }`}
            >
              야송 이야기
            </button>
            {/* 야송 이야기 하위 메뉴 */}
            <div className={`py-1 transition-colors duration-700 ${
              isDarkBackground ? 'bg-[#2C2C2C]/3' : 'bg-[#F4F4F0]/3'
            }`}>
              <button
                onClick={() => {
                  navigate('/biography');
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-10 py-2 text-sm transition-colors duration-700 ${
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
                className={`block w-full text-left px-10 py-2 text-sm transition-colors duration-700 ${
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
                className={`block w-full text-left px-10 py-2 text-sm transition-colors duration-700 ${
                  isDarkBackground 
                    ? 'text-[#2C2C2C]/80 hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                    : 'text-[#F4F4F0]/80 hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                }`}
              >
                • 화업의 평가, 평론
              </button>
              <button
                onClick={() => {
                  navigate('/photos');
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-10 py-2 text-sm transition-colors duration-700 ${
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
              className={`block w-full text-left px-4 py-3 font-medium transition-colors duration-700 ${
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
              className={`block w-full text-left px-4 py-3 font-medium transition-colors duration-700 ${
                isDarkBackground 
                  ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                  : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
              }`}
            >
              전시
            </button>
            {/* 전시 하위 메뉴 */}
            <div className={`py-1 transition-colors duration-700 ${
              isDarkBackground ? 'bg-[#2C2C2C]/3' : 'bg-[#F4F4F0]/3'
            }`}>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/exhibitions');
                }}
                className={`block w-full text-left px-10 py-2 text-sm transition-colors duration-700 ${
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
                className={`block w-full text-left px-10 py-2 text-sm transition-colors duration-700 ${
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
                navigate('/contests');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-medium transition-colors duration-700 ${
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
              className={`block w-full text-left px-4 py-3 font-medium transition-colors duration-700 ${
                isDarkBackground 
                  ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                  : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
              }`}
            >
              공지사항
            </button>
            
            {/* 로그인 상태에 따른 버튼 */}
            <div className={`border-t pt-4 mt-4 space-y-2 transition-colors duration-700 ${
              isDarkBackground ? 'border-[#2C2C2C]/20' : 'border-[#F4F4F0]/20'
            }`}>
              {user && (
                <>
                  {/* 관리자 메뉴 (모바일) */}
                  {isManagerOrAbove(user.role) && (
                    <div className={`border-b pb-3 mb-3 transition-colors duration-700 ${
                      isDarkBackground ? 'border-[#2C2C2C]/20' : 'border-[#F4F4F0]/20'
                    }`}>
                      <div className="px-4 py-2 text-sm text-[#C84630] font-bold">관리</div>
                      {isAdmin(user.role) && (
                        <button
                          onClick={() => {
                            navigate('/admin/users');
                            setIsMenuOpen(false);
                          }}
                          className={`block w-full text-left px-8 py-2 transition-colors duration-700 ${
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
                        className={`block w-full text-left px-8 py-2 transition-colors duration-700 ${
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
                          className={`block w-full text-left px-8 py-2 transition-colors duration-700 ${
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
                    className={`block w-full text-left px-4 py-3 transition-colors duration-700 ${
                      isDarkBackground 
                        ? 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
                        : 'text-[#F4F4F0] hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
                    }`}
                  >
                    내정보
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-3 transition-colors duration-700 ${
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
