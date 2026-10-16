import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DesktopNavigation } from './DesktopNavigation';
import { DesktopUserMenu } from './DesktopUserMenu';
import { MobileNavigation } from './MobileNavigation';
import { useHeaderTheme } from './hooks/useHeaderTheme';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, logout } = useAuth();

  const { isDarkBackground, isPageTransitioning } = useHeaderTheme(location.pathname);

  const closeMenu = () => setIsMenuOpen(false);

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
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        isPageTransitioning ? 'transition-none' : 'transition-colors duration-700'
      } ${isDarkBackground ? 'bg-[#F4F4F0]/98' : 'bg-[#2C2C2C]/98'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 py-4">
          {/* 로고 */}
          <div
            className="cursor-pointer flex items-center gap-3 flex-shrink-0"
            onClick={() => scrollToSection('hero')}
          >
            <img src="/yasong-icon.png" alt="야송 로고" className="w-10 h-10 sm:w-12 sm:h-12" />
            <div className="flex items-center gap-2">
              <h1
                className={`text-xl sm:text-2xl font-bold tracking-wider transition-colors duration-700 ${
                  isDarkBackground ? 'text-[#2C2C2C]' : 'text-[#F4F4F0]'
                }`}
              >
                YASONG
              </h1>
            </div>
          </div>

          {/* 데스크톱 네비게이션 - 중앙 정렬 */}
          <DesktopNavigation isDarkBackground={isDarkBackground} onClose={closeMenu} />

          {/* 오른쪽 영역 - 관리자 메뉴 및 모바일 버튼 */}
          <div className="flex items-center gap-4 ml-auto">
            {/* 관리자 로그인 버튼들 (데스크톱) */}
            <DesktopUserMenu
              isDarkBackground={isDarkBackground}
              onClose={closeMenu}
              user={user}
              handleLogout={handleLogout}
            />

            {/* 모바일 메뉴 버튼 */}
            <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X
                  className={`w-6 h-6 transition-colors duration-700 ${isDarkBackground ? 'text-[#2C2C2C]' : 'text-[#F4F4F0]'}`}
                />
              ) : (
                <Menu
                  className={`w-6 h-6 transition-colors duration-700 ${isDarkBackground ? 'text-[#2C2C2C]' : 'text-[#F4F4F0]'}`}
                />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <MobileNavigation
            isDarkBackground={isDarkBackground}
            onClose={closeMenu}
            user={user}
            handleLogout={handleLogout}
          />
        )}
      </div>
    </header>
  );
}
