import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft, Search, ChevronRight, Pin } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { noticeAPI } from '@/utils/api';

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  viewCount: number;
  status: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export function NoticePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'전체' | '일반' | '전시' | '공모전'| '시스템'>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 관리자 권한 확인
  const canManage = user && isManagerOrAbove(user.role);

  // 공지사항 목록 로드
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        const data = canManage 
          ? await noticeAPI.getAllNotices() // 관리자: 전체 목록 (숨김/임시저장 포함)
          : await noticeAPI.getVisibleNotices();    // 일반: 공개된 것만
        setNotices(data);
      } catch (err) {
        console.error('공지사항 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [canManage]);

  // 카테고리 표시 이름 변환
  const getCategoryDisplayName = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'GENERAL': '일반',
      'EXHIBITION': '전시',
      'CONTEST': '공모전',
      'MAINTENANCE': '시스템'
    };
    return categoryMap[category] || category;
  };

  // 상태 표시 이름 변환
  const getStatusDisplayName = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'PUBLISHED': '게시됨',
      'DRAFT': '임시저장',
      'HIDDEN': '숨김'
    };
    return statusMap[status] || status;
  };

  // 검색 및 필터링
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || getCategoryDisplayName(notice.category) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 고정 공지를 먼저 정렬
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotices = sortedNotices.slice(startIndex, endIndex);

  // 페이지 변경 시 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 검색어나 카테고리 변경 시 첫 페이지로 리셋
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: '전체' | '일반' | '전시' | '공모전' | '시스템') => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // 공지사항 삭제
  const handleDelete = async (noticeId: number, title: string) => {
    const confirmed = window.confirm(`"${title}" 공지사항을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      await noticeAPI.deleteNotice(noticeId.toString());
      alert('공지사항이 삭제되었습니다.');
      setNotices(notices.filter(n => n.id !== noticeId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* 메인 컨텐츠 - 헤더 높이만큼 상단 여백 추가 */}
      <div className="pt-24">
        {!selectedNotice ? (
          // 공지사항 목록
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* 페이지 헤더 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Bell className="w-8 h-8 text-teal-800 mr-3" />
                  <h1 className="text-4xl font-bold text-teal-900">공지사항</h1>
                </div>
                {canManage && (
                  <Button
                    onClick={() => navigate('/notice/write')}
                    className="bg-teal-700 hover:bg-teal-800 text-white"
                  >
                    글 작성
                  </Button>
                )}
              </div>
              <Link 
                to="/" 
                className="inline-flex items-center text-gray-600 hover:text-teal-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                홈으로 돌아가기
              </Link>
            </div>

            {/* 검색 및 필터 */}
            <div className="mb-8 bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* 검색바 */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="공지사항 검색..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* 카테고리 필터 */}
                <div className="flex gap-2 flex-wrap">
                  {(['전체', '일반', '전시', '공모전', '시스템'] as const).map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-teal-700 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 공지사항 목록 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">로딩 중...</p>
                </div>
              ) : currentNotices.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {currentNotices.map((notice) => (
                    <div
                      key={notice.id}
                      className="p-5 hover:bg-teal-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => {
                            setSelectedNotice(notice);
                            window.scrollTo(0, 0);
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {notice.isPinned && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                <Pin className="w-3 h-3" />
                                고정
                              </span>
                            )}
                            <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
                              {getCategoryDisplayName(notice.category)}
                            </span>
                            {canManage && notice.status !== 'PUBLISHED' && (
                              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                                {getStatusDisplayName(notice.status)}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {notice.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {notice.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            작성자: {notice.authorName} | {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        <div className="ml-4 flex flex-col items-end gap-2">
                          <div className="text-right">
                            <p className="text-xs text-gray-400">조회 {notice.viewCount}</p>
                          </div>
                          {canManage && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => navigate(`/notice/write?id=${notice.id}`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                              >
                                수정
                              </Button>
                              <Button
                                onClick={() => handleDelete(notice.id, notice.title)}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
                              >
                                삭제
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            {filteredNotices.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  {/* 이전 페이지 버튼 */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md transition-colors ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* 페이지 번호 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        currentPage === page
                          ? 'bg-teal-700 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* 다음 페이지 버튼 */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md transition-colors ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // 공지사항 상세보기
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* 헤더 */}
              <div className="bg-teal-700 text-white p-6">
                <div className="flex items-center gap-2 mb-3">
                  {selectedNotice.isPinned && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Pin className="w-3 h-3" />
                      고정
                    </span>
                  )}
                  <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded">
                    {getCategoryDisplayName(selectedNotice.category)}
                  </span>
                  {canManage && selectedNotice.status !== 'PUBLISHED' && (
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                      {getStatusDisplayName(selectedNotice.status)}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold mb-3">{selectedNotice.title}</h1>
                <div className="flex items-center text-teal-100 text-sm gap-4">
                  <span>작성자: {selectedNotice.authorName}</span>
                  <span>작성일: {new Date(selectedNotice.createdAt).toLocaleDateString('ko-KR')}</span>
                  <span>조회수: {selectedNotice.viewCount}</span>
                </div>
              </div>

              {/* 본문 */}
              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedNotice.content}
                  </p>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="border-t border-gray-200 p-6 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedNotice(null);
                    window.scrollTo(0, 0);
                  }}
                  className="px-6 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-colors"
                >
                  목록으로
                </button>
                <Link
                  to="/"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  홈으로
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
