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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-sm shadow-md border-b-2 border-teal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* 로고 */}
          <div className="cursor-pointer" onClick={() => scrollToSection('hero')}>
            <h1 className="text-xl sm:text-2xl text-teal-900">
              군립청송야송미술관
            </h1>
            <p className="text-xs sm:text-sm text-teal-700">Cheongsong Yasong Art Gallery</p>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex space-x-8">
            {/* 공지사항 드롭다운 */}
            <div className="relative group">
              <button
                className="text-gray-800 hover:text-teal-700 transition-colors flex items-center py-2"
                onClick={() => scrollToSection('notice')}
                onMouseEnter={() => setIsNoticeDropdownOpen(true)}
                onMouseLeave={() => setIsNoticeDropdownOpen(false)}
              >
                공지사항
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {isNoticeDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg border border-teal-100 rounded-b-md"
                  onMouseEnter={() => setIsNoticeDropdownOpen(true)}
                  onMouseLeave={() => setIsNoticeDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      navigate('/notice');
                      setIsMenuOpen(false);
                      setIsNoticeDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    공지사항 목록
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => scrollToSection('contest')}
              className="text-gray-800 hover:text-teal-700 transition-colors"
            >
              미술대전
            </button>
            {/* 미술관 소개 드롭다운 */}
            <div className="relative group">
              <button
                className="text-gray-800 hover:text-teal-700 transition-colors flex items-center py-2"
                onClick={() => scrollToSection('director')}
                onMouseEnter={() => setIsAboutDropdownOpen(true)}
                onMouseLeave={() => setIsAboutDropdownOpen(false)}
              >
                미술관 소개
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {isAboutDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg border border-teal-100 rounded-b-md"
                  onMouseEnter={() => setIsAboutDropdownOpen(true)}
                  onMouseLeave={() => setIsAboutDropdownOpen(false)}
                >
                  <button
                    onClick={() => scrollToSection('director')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors border-b border-gray-100"
                  >
                    이원좌 초대 관장
                  </button>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors border-b border-gray-100"
                  >
                    미술관 연혁
                  </button>
                  <button
                    onClick={() => scrollToSection('collections')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors border-b border-gray-100"
                  >
                    대표 소장품
                  </button>
                </div>
              )}
            </div>

            

            {/* 전시일정 드롭다운 */}
            <div className="relative group">
              <button
                className="text-gray-800 hover:text-teal-700 transition-colors flex items-center py-2"
                onClick={() => scrollToSection('exhibitions')}
                onMouseEnter={() => setIsExhibitionDropdownOpen(true)}
                onMouseLeave={() => setIsExhibitionDropdownOpen(false)}
              >
                전시 일정
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {isExhibitionDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg border border-teal-100 rounded-b-md"
                  onMouseEnter={() => setIsExhibitionDropdownOpen(true)}
                  onMouseLeave={() => setIsExhibitionDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      navigate('/exhibitions');
                      setIsMenuOpen(false);
                      setIsExhibitionDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    전시일정 목록
                  </button>
                </div>
              )}
            </div>
            
            {/* 기념품 드롭다운 */}
            <div className="relative group">
              <button
                className="text-gray-800 hover:text-teal-700 transition-colors flex items-center py-2"
                onClick={() => scrollToSection('shop')}
                onMouseEnter={() => setIsSouvenirDropdownOpen(true)}
                onMouseLeave={() => setIsSouvenirDropdownOpen(false)}
              >
                기념품
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {isSouvenirDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg border border-teal-100 rounded-b-md"
                  onMouseEnter={() => setIsSouvenirDropdownOpen(true)}
                  onMouseLeave={() => setIsSouvenirDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      navigate('/souvenirs');
                      setIsMenuOpen(false);
                      setIsSouvenirDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    기념품 목록
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => scrollToSection('visit')}
              className="text-gray-800 hover:text-teal-700 transition-colors"
            >
              관람 안내
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="text-gray-800 hover:text-teal-700 transition-colors"
            >
              오시는 길
            </button>
            
            {/* 로그인 상태에 따른 버튼 */}
            {user ? (
              <>
                {/* 관리자 메뉴 (MANAGER, ADMIN) */}
                {isManagerOrAbove(user.role) && (
                  <div className="relative group">
                    <button className="text-gray-800 hover:text-teal-700 transition-colors flex items-center py-2">
                      관리
                      <ChevronDown className="ml-1 w-4 h-4" />
                    </button>
                    <div className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg border border-teal-100 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      {isAdmin(user.role) && (
                        <button
                          onClick={() => {
                            navigate('/admin/users');
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors border-b border-gray-100"
                        >
                          사용자 관리
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigate('/admin/website');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        홈페이지 관리
                      </button>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/profile')}
                  className="text-gray-800 hover:text-teal-700 transition-colors"
                >
                  내정보
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-800 hover:text-teal-700 transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-colors"
                >
                  회원가입
                </button>
              </>
            )}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-1">
            <div className="border-b border-teal-100 pb-2 mb-2">
              <div className="px-4 py-2 text-sm text-teal-800">미술관 소개</div>
              <button
                onClick={() => scrollToSection('director')}
                className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                이원좌 초대 관장
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                미술관 연혁
              </button>
              <button
                onClick={() => scrollToSection('collections')}
                className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                대표 소장품
              </button>
              <button
                onClick={() => scrollToSection('programs')}
                className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                교육 프로그램
              </button>
              <button
                onClick={() => scrollToSection('shop')}
                className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                뮤지엄샵
              </button>
            </div>
            <div className="border-b border-teal-100 pb-2 mb-2">
              <div className="px-4 py-2 text-sm text-teal-800">공지사항</div>
              <button
                onClick={() => scrollToSection('notice')}
                className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                공지사항 보기
              </button>
              <button
                onClick={() => {
                  navigate('/notice');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                공지사항 목록
              </button>
            </div>
            <div className="border-b border-teal-100 pb-2 mb-2">
              <div className="px-4 py-2 text-sm text-teal-800">전시 일정</div>
              <button
                onClick={() => scrollToSection('exhibitions')}
                className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                전시 일정 보기
              </button>
              <button
                onClick={() => {
                  navigate('/exhibitions');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                전시일정 목록
              </button>
            </div>
            <div className="border-b border-teal-100 pb-2 mb-2">
              <div className="px-4 py-2 text-sm text-teal-800">기념품</div>
              <button
                onClick={() => scrollToSection('shop')}
                className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                기념품 보기
              </button>
              <button
                onClick={() => {
                  navigate('/souvenirs');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                기념품 목록
              </button>
            </div>
            <button
              onClick={() => scrollToSection('visit')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
            >
              관람 안내
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
            >
              오시는 길
            </button>
            
            {/* 로그인 상태에 따른 버튼 */}
            <div className="border-t border-teal-100 pt-2 mt-2 space-y-2">
              {user ? (
                <>
                  {/* 관리자 메뉴 (모바일) */}
                  {isManagerOrAbove(user.role) && (
                    <div className="border-b border-teal-100 pb-2 mb-2">
                      <div className="px-4 py-2 text-sm text-teal-800">관리</div>
                      {isAdmin(user.role) && (
                        <button
                          onClick={() => {
                            navigate('/admin/users');
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        >
                          사용자 관리
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigate('/admin/website');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-8 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        홈페이지 관리
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    내정보
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 bg-teal-700 text-white hover:bg-teal-800 transition-colors rounded"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 bg-teal-700 text-white hover:bg-teal-800 transition-colors rounded"
                  >
                    회원가입
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
