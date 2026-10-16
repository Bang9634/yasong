import type { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isManagerOrAbove, isAdmin } from '@/utils/auth';

interface NavigationProps {
  isDarkBackground: boolean;
  onClose: () => void;
}

interface DesktopUserMenuProps extends NavigationProps {
  user: ReturnType<typeof useAuth>['user'];
  handleLogout: () => void;
}

export function DesktopUserMenu({
  isDarkBackground,
  onClose,
  user,
  handleLogout,
}: DesktopUserMenuProps) {
  const navigate = useNavigate();
  return (
    <>
      {user && (
        <div className="hidden lg:flex items-center gap-4">
          {/* 관리자 메뉴 (MANAGER, ADMIN) */}
          {isManagerOrAbove(user.role) && (
            <div className="relative group">
              <button
                className={`transition-colors duration-700 py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C84630] after:transition-all after:duration-300 hover:after:w-full ${
                  isDarkBackground
                    ? 'text-[#2C2C2C] hover:text-[#C84630]'
                    : 'text-[#F4F4F0] hover:text-[#C84630]'
                }`}
              >
                관리
              </button>
              <div
                className={`absolute top-full right-0 mt-3 w-44 shadow-lg border rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 z-50 ${
                  isDarkBackground
                    ? 'bg-[#F4F4F0] border-[#E0E0E0]'
                    : 'bg-[#2C2C2C] border-[#404040]'
                }`}
              >
                {isAdmin(user.role) && (
                  <button
                    onClick={() => {
                      navigate('/admin/users');
                      onClose();
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
                    onClose();
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
                      onClose();
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
    </>
  );
}
