import { Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NoticeItem {
  id: number;
  title: string;
  date: string;
  isImportant: boolean;
}

const notices: NoticeItem[] = [
  {
    id: 1,
    title: '2026년 설 연휴 휴관 안내',
    date: '2026.01.10',
    isImportant: true
  },
  {
    id: 2,
    title: '이원좌 화백 탄생 100주년 특별전 개최 안내',
    date: '2026.01.08',
    isImportant: true
  },
  {
    id: 3,
    title: '겨울방학 어린이 미술교실 수강생 모집',
    date: '2026.01.05',
    isImportant: false
  },
  {
    id: 4,
    title: '1월 문화가 있는 날 무료 관람 안내',
    date: '2026.01.03',
    isImportant: false
  },
  {
    id: 5,
    title: '미술관 주차장 확장 공사 완료',
    date: '2025.12.28',
    isImportant: false
  }
];

export function Notice() {
  const navigate = useNavigate();

  return (
    <section id="notice" className="py-20 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-12">
          <Bell className="w-8 h-8 text-teal-800 mr-3" />
          <h2 className="text-4xl sm:text-5xl text-teal-900">공지사항</h2>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-teal-100">
          {notices.map((notice, index) => (
            <div
              key={notice.id}
              onClick={() => navigate('/notice')}
              className={`flex items-center justify-between p-5 hover:bg-teal-50 transition-colors cursor-pointer ${
                index !== notices.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex items-center flex-1">
                {notice.isImportant && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded mr-3">
                    중요
                  </span>
                )}
                <h3 className="text-gray-800 flex-1">{notice.title}</h3>
              </div>
              <div className="flex items-center text-gray-500">
                <span className="text-sm mr-4">{notice.date}</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/notice')}
            className="px-8 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
          >
            공지사항 더보기
          </button>
        </div>
      </div>
    </section>
  );
}
