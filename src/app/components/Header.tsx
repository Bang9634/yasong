import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F4F4F0]/98 ">
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
              <h1 className="text-xl sm:text-2xl font-bold text-[#2C2C2C] tracking-wider">
                YASONG
              </h1>
            </div>
          </div>

          {/* 데스크톱 네비게이션 - 중앙 정렬 */}
          <nav className="hidden lg:flex space-x-10 absolute left-1/2 -translate-x-1/2">
            {/* 야송 이야기 드롭다운 */}
            <div className="relative group">
              <button
                className="text-[#2C2C2C] hover:text-[#C84630] transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full"
              >
                야송 이야기
              </button>
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 bg-[#F4F4F0] shadow-lg border border-[#E0E0E0] rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
              >
                <button
                  onClick={() => scrollToSection('director')}
                  className="block w-full text-left px-4 py-2.5 text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630] transition-all"
                >
                  약력
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // TODO: 일대기 페이지 구현 후 navigate 추가
                  }}
                  className="block w-full text-left px-4 py-2.5 text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630] transition-all"
                >
                  일대기
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // TODO: 화업의 평가 페이지 구현 후 navigate 추가
                  }}
                  className="block w-full text-left px-4 py-2.5 text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630] transition-all"
                >
                  화업의 평가, 평론
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // TODO: 사진 자료 페이지 구현 후 navigate 추가
                  }}
                  className="block w-full text-left px-4 py-2.5 text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630] transition-all"
                >
                  사진 자료
                </button>
              </div>
            </div>

            {/* 작품 소개 */}
            <button
              onClick={() => { navigate('/collections'); }}
              className="text-[#2C2C2C] hover:text-[#C84630] transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full"
            >
              작품 소개
            </button>

            {/* 전시 드롭다운 */}
            <div className="relative group">
              <button
                onClick={() => { navigate('/exhibitions'); }}
                className="text-[#2C2C2C] hover:text-[#C84630] transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full"
              >
                전시
              </button>
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 bg-[#F4F4F0] shadow-lg border border-[#E0E0E0] rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
              >
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // TODO: 추모 전시 페이지 구현 후 navigate 추가
                  }}
                  className="block w-full text-left px-4 py-2.5 text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630] transition-all"
                >
                  추모 전시
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // TODO: 회고전 페이지 구현 후 navigate 추가
                  }}
                  className="block w-full text-left px-4 py-2.5 text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630] transition-all"
                >
                  회고전
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // TODO: 언론 보도 페이지 구현 후 navigate 추가
                  }}
                  className="block w-full text-left px-4 py-2.5 text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630] transition-all"
                >
                  언론 보도, SNS 소개글
                </button>
              </div>
            </div>

            {/* 공모전 */}
            <button
              onClick={() => scrollToSection('contest')}
              className="text-[#2C2C2C] hover:text-[#C84630] transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full"
            >
              공모전
            </button>

            {/* 공지사항 */}
            <button
              onClick={() => {
                navigate('/notice');
                setIsMenuOpen(false);
              }}
              className="text-[#2C2C2C] hover:text-[#C84630] transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full"
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
                    <button className="text-[#2C2C2C] hover:text-[#C84630] transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full">
                      관리
                    </button>
                    <div className="absolute top-full right-0 mt-3 w-44 bg-[#F4F4F0] shadow-lg border border-[#E0E0E0] rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      {isAdmin(user.role) && (
                        <button
                          onClick={() => {
                            navigate('/admin/users');
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630] transition-all"
                        >
                          사용자 관리
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigate('/admin/website');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630] transition-all"
                      >
                        홈페이지 관리
                      </button>
                      {isAdmin(user.role) && (
                        <button
                          onClick={() => {
                            navigate('/admin/analytics');
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630] transition-all"
                        >
                          통계
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/profile')}
                  className="text-[#2C2C2C] hover:text-[#C84630] transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full"
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
                <X className="w-6 h-6 text-[#2C2C2C]" />
              ) : (
                <Menu className="w-6 h-6 text-[#2C2C2C]" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-6 space-y-2">
            {/* 야송 이야기 드롭다운 */}
            <div className="border-b border-[#E0E0E0] pb-3 mb-3">
              <div className="px-4 py-2 text-sm text-[#C84630] font-bold">야송 이야기</div>
              <button
                onClick={() => {
                  scrollToSection('director');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-8 py-2 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
              >
                약력
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: 일대기 페이지 구현 후 navigate 추가
                }}
                className="block w-full text-left px-8 py-2 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
              >
                일대기
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: 화업의 평가 페이지 구현 후 navigate 추가
                }}
                className="block w-full text-left px-8 py-2 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
              >
                화업의 평가, 평론
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: 사진 자료 페이지 구현 후 navigate 추가
                }}
                className="block w-full text-left px-8 py-2 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
              >
                사진 자료
              </button>
            </div>
            
            {/* 작품 소개 */}
            <button
              onClick={() => {
                scrollToSection('collections');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
            >
              작품 소개
            </button>
            
            {/* 전시 드롭다운 */}
            <div className="border-b border-[#E0E0E0] pb-3 mb-3">
              <div className="px-4 py-2 text-sm text-[#C84630] font-bold">전시</div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: 추모 전시 페이지 구현 후 navigate 추가
                }}
                className="block w-full text-left px-8 py-2 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
              >
                추모 전시
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: 회고전 페이지 구현 후 navigate 추가
                }}
                className="block w-full text-left px-8 py-2 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
              >
                회고전
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: 언론 보도 페이지 구현 후 navigate 추가
                }}
                className="block w-full text-left px-8 py-2 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
              >
                언론 보도, SNS 소개글
              </button>
            </div>
            
            {/* 공모전 */}
            <button
              onClick={() => {
                scrollToSection('contest');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
            >
              공모전
            </button>
            
            {/* 공지사항 */}
            <button
              onClick={() => {
                navigate('/notice');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
            >
              공지사항
            </button>
            
            {/* 로그인 상태에 따른 버튼 */}
            <div className="border-t border-[#E0E0E0] pt-4 mt-4 space-y-2">
              {user && (
                <>
                  {/* 관리자 메뉴 (모바일) */}
                  {isManagerOrAbove(user.role) && (
                    <div className="border-b border-[#E0E0E0] pb-3 mb-3">
                      <div className="px-4 py-2 text-sm text-[#C84630] font-bold">관리</div>
                      {isAdmin(user.role) && (
                        <button
                          onClick={() => {
                            navigate('/admin/users');
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-8 py-2 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
                        >
                          사용자 관리
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigate('/admin/website');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-8 py-2 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
                      >
                        홈페이지 관리
                      </button>
                      {isAdmin(user.role) && (
                        <button
                          onClick={() => {
                            navigate('/admin/analytics');
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-8 py-2 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
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
                    className="block w-full text-left px-4 py-3 text-[#2C2C2C] hover:bg-white hover:text-[#C84630] transition-colors"
                  >
                    내정보
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 bg-[#C84630] text-white hover:bg-[#A83820] transition-colors"
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
