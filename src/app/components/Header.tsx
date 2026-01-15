import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      setIsAboutDropdownOpen(false);
    }
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
            <p className="text-xs sm:text-sm text-teal-700">Cheongsung Yasong Art Museum</p>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex space-x-8">
            {/* 미술관 소개 드롭다운 */}
            <div className="relative group">
              <button
                className="text-gray-800 hover:text-teal-700 transition-colors flex items-center py-2"
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
                  <button
                    onClick={() => scrollToSection('programs')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors border-b border-gray-100"
                  >
                    교육 프로그램
                  </button>
                  <button
                    onClick={() => scrollToSection('shop')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    뮤지엄샵
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection('notice')}
              className="text-gray-800 hover:text-teal-700 transition-colors"
            >
              공지사항
            </button>
            <button
              onClick={() => scrollToSection('exhibitions')}
              className="text-gray-800 hover:text-teal-700 transition-colors"
            >
              전시 일정
            </button>
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
            <button
              onClick={() => scrollToSection('notice')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
            >
              공지사항
            </button>
            <button
              onClick={() => scrollToSection('exhibitions')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
            >
              전시 일정
            </button>
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
            <div className="border-t border-teal-100 pt-2 mt-2 space-y-2">
              <button
                onClick={() => navigate('/login')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="block w-full text-left px-4 py-2 bg-teal-700 text-white hover:bg-teal-800 transition-colors rounded"
              >
                회원가입
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
