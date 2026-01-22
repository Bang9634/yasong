import { useState, useEffect } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { noticeAPI } from '@/utils/api';

interface NoticeItem {
  id: number;
  title: string;
  category: string;
  isPinned: boolean;
  viewCount: number;
  status: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export function Notice() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 공지사항 데이터 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        const data = await noticeAPI.getVisibleNotices(); // 공개된 공지사항만
        
        // isPinned 우선, 날짜 내림차순으로 정렬 후 상위 5개만
        const sortedData = [...data]
          .sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .slice(0, 5);
        
        setNotices(sortedData);
      } catch (err) {
        console.error('공지사항 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <section id="notice" className="py-20 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-12">
          <Bell className="w-8 h-8 text-teal-800 mr-3" />
          <h2 className="text-4xl sm:text-5xl text-teal-900">공지사항</h2>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-teal-100">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              로딩 중...
            </div>
          ) : notices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              등록된 공지사항이 없습니다.
            </div>
          ) : (
            notices.map((notice, index) => (
              <div
                key={notice.id}
                onClick={() => navigate('/notice')}
                className={`flex items-center justify-between p-5 hover:bg-teal-50 transition-colors cursor-pointer ${
                  index !== notices.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div className="flex items-center flex-1">
                  {notice.isPinned && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded mr-3">
                      고정
                    </span>
                  )}
                  <h3 className="text-gray-800 flex-1">{notice.title}</h3>
                </div>
                <div className="flex items-center text-gray-500">
                  <span className="text-sm mr-4">{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))
          )}
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
