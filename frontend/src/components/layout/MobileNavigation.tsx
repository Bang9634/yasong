import type { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isManagerOrAbove, isAdmin } from '@/utils/auth';

interface NavigationProps {
  isDarkBackground: boolean;
  onClose: () => void;
}

interface MobileNavigationProps extends NavigationProps {
  user: ReturnType<typeof useAuth>['user'];
  handleLogout: () => void;
}

export function MobileNavigation({
  isDarkBackground,
  onClose,
  user,
  handleLogout,
}: MobileNavigationProps) {
  const navigate = useNavigate();
  return (
    <nav className="lg:hidden pb-6 space-y-0.5 max-h-[calc(100vh-80px)] overflow-y-auto">
      {/* 야송 이야기 */}
      <button
        onClick={() => {
          navigate('/story');
          onClose();
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
      <div
        className={`py-1 transition-colors duration-700 ${
          isDarkBackground ? 'bg-[#2C2C2C]/3' : 'bg-[#F4F4F0]/3'
        }`}
      >
        <button
          onClick={() => {
            navigate('/biography');
            onClose();
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
            onClose();
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
            onClose();
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
            onClose();
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
          onClose();
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
          onClose();
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
      <div
        className={`py-1 transition-colors duration-700 ${
          isDarkBackground ? 'bg-[#2C2C2C]/3' : 'bg-[#F4F4F0]/3'
        }`}
      >
        <button
          onClick={() => {
            onClose();
            navigate('/exhibitions');
          }}
          className={`block w-full text-left px-10 py-2 text-sm transition-colors duration-700 ${
            isDarkBackground
              ? 'text-[#2C2C2C]/80 hover:bg-[#2C2C2C]/5 hover:text-[#C84630]'
              : 'text-[#F4F4F0]/80 hover:bg-[#F4F4F0]/5 hover:text-[#C84630]'
          }`}
        >
          • 전시 안내
        </button>
        <button
          onClick={() => {
            onClose();
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
          onClose();
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
          onClose();
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
      <div
        className={`border-t pt-4 mt-4 space-y-2 transition-colors duration-700 ${
          isDarkBackground ? 'border-[#2C2C2C]/20' : 'border-[#F4F4F0]/20'
        }`}
      >
        {user && (
          <>
            {/* 관리자 메뉴 (모바일) */}
            {isManagerOrAbove(user.role) && (
              <div
                className={`border-b pb-3 mb-3 transition-colors duration-700 ${
                  isDarkBackground ? 'border-[#2C2C2C]/20' : 'border-[#F4F4F0]/20'
                }`}
              >
                <div className="px-4 py-2 text-sm text-[#C84630] font-bold">관리</div>
                {isAdmin(user.role) && (
                  <button
                    onClick={() => {
                      navigate('/admin/users');
                      onClose();
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
                    onClose();
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
                      onClose();
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
                onClose();
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
  );
}
