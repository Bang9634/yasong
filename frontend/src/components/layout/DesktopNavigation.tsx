import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  isDarkBackground: boolean;
  onClose: () => void;
}

export function DesktopNavigation({ isDarkBackground, onClose }: NavigationProps) {
  const navigate = useNavigate();
  return (
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
            isDarkBackground ? 'bg-[#F4F4F0] border-[#E0E0E0]' : 'bg-[#2C2C2C] border-[#404040]'
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
              onClose();
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
              onClose();
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
              onClose();
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
        onClick={() => {
          navigate('/collections');
        }}
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
          onClick={() => {
            navigate('/exhibitions');
          }}
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
            isDarkBackground ? 'bg-[#F4F4F0] border-[#E0E0E0]' : 'bg-[#2C2C2C] border-[#404040]'
          }`}
        >
          <button
            onClick={() => {
              onClose();
              navigate('/exhibitions');
            }}
            className={`block w-full text-left px-4 py-2.5 transition-all duration-700 ${
              isDarkBackground
                ? 'text-[#2C2C2C] hover:bg-[#C84630]/5 hover:text-[#C84630]'
                : 'text-[#F4F4F0] hover:bg-[#C84630]/20 hover:text-[#C84630]'
            }`}
          >
            전시 안내
          </button>
          <button
            onClick={() => {
              onClose();
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
          onClose();
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
  );
}
