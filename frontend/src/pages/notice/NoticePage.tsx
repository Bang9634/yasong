import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Pin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { noticeAPI } from '@/utils/api';
import { setPageSEO } from '@/utils/seo';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageInput, setPageInput] = useState('');
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const itemsPerPage = 10;

  // 관리자 권한 확인
  const canManage = user && isManagerOrAbove(user.role);

  // SEO 설정
  useEffect(() => {
    setPageSEO({
      title: '공지사항',
      description: '야송 이원좌 화백 작품 관련 최신 소식, 전시 안내, 공모전 정보를 확인하실 수 있습니다.',
      keywords: '야송 공지사항, 전시 안내, 공모전, 야송 소식',
    });
  }, []);

  // 카드 애니메이션을 위한 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.getAttribute('data-card-id') || '0');
            setVisibleCards((prev) => new Set(prev).add(cardId));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const cards = document.querySelectorAll('[data-card-id]');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [notices]);

  // 공지사항 목록 로드
  const loadNotices = async () => {
    try {
      setIsLoading(true);

      const categoryMap: { [key: string]: string } = {
        '일반': 'GENERAL',
        '전시': 'EXHIBITION',
        '공모전': 'CONTEST',
        '시스템': 'MAINTENANCE'
      };

      // 임시저장/숨김 탭인 경우 관리자 API 사용
      const isStatusTab = selectedCategory === '임시저장' || selectedCategory === '숨김';

      let params: any = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
      };

      if (selectedCategory === '임시저장') {
        params.status = 'DRAFT';
      } else if (selectedCategory === '숨김') {
        params.status = 'HIDDEN';
      } else if (selectedCategory !== '전체') {
        params.category = categoryMap[selectedCategory];
      }

      // 상태 탭이면 관리자 API, 아니면 공개 API 호출
      const response = isStatusTab 
        ? await noticeAPI.getManagementNotices(params)
        : await noticeAPI.getNotices(params);

      setNotices(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalCount(response.totalElements || 0);
    } catch (err) {
      console.error('공지사항 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지/필터 변경 시 데이터 재로드
  useEffect(() => {
    setVisibleCards(new Set());
    loadNotices();
  }, [currentPage, searchQuery, selectedCategory]);

  // 검색어나 카테고리 변경 시 1페이지로 리셋
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedCategory]);

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
      'PUBLISHED': '공개',
      'DRAFT': '임시저장',
      'HIDDEN': '숨김'
    };
    return statusMap[status] || status;
  };

  // 상태 배지 색상
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-700';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-700';
      case 'HIDDEN':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // 공지사항 삭제
  const handleDelete = async (noticeId: number, title: string) => {
    const confirmed = window.confirm(`"${title}" 공지사항을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      await noticeAPI.deleteNotice(noticeId.toString());
      alert('공지사항이 삭제되었습니다.');
      loadNotices();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      
      <div className="pt-24 pb-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] tracking-tight mb-2">공지사항</h1>
              <p className="text-[#2C2C2C]/70">야송 홈페이지의 최신 소식을 확인할 수 있습니다.</p>
            </div>
            {canManage && (
              <button
                onClick={() => navigate('/notice/write')}
                className="px-6 py-2 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                글 작성
              </button>
            )}
          </div>

          {/* 검색창 */}
          <div className="mb-8">
            <div className="max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C2C2C]/40 w-4 h-4" />
              <input
                type="text"
                placeholder="공지사항 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#2C2C2C]/10 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#2C2C2C] placeholder:text-[#2C2C2C]/40"
              />
            </div>
          </div>

          {/* 카테고리 탭 */}
          <div className="mb-8 border-b border-[#2C2C2C]/20">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {['전체', '일반', '전시', '공모전', '시스템', ...(canManage ? ['임시저장', '숨김'] : [])].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    pb-3 px-2 font-medium transition-all whitespace-nowrap relative
                    ${selectedCategory === category 
                      ? 'text-[#C84630]' 
                      : 'text-[#2C2C2C]/60 hover:text-[#2C2C2C]'}
                  `}
                >
                  {category}
                  {selectedCategory === category && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 공지사항 리스트 */}
          <div className="space-y-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-[#2C2C2C] text-lg">로딩 중...</div>
              </div>
            ) : !notices || notices.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-[#2C2C2C]/60 text-lg">공지사항이 없습니다.</div>
              </div>
            ) : (
              notices.map((notice, index) => (
                <div
                  key={notice.id}
                  data-card-id={notice.id}
                  className={`group transition-all duration-700 ${
                    visibleCards.has(notice.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 30}ms` }}
                >
                  <div 
                    className="bg-white border border-[#2C2C2C]/10 hover:border-[#C84630]/50 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
                    onClick={() => navigate(`/notice/${notice.id}`)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* 왼쪽: 메인 컨텐츠 */}
                      <div className="flex-1 min-w-0">
                        {/* 배지와 제목 */}
                        <div className="flex items-center gap-2 mb-1">
                          {notice.isPinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C84630] text-[#F4F4F0] text-xs rounded font-medium">
                              <Pin className="w-3 h-3" />
                              고정
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-[#2C2C2C]/5 text-[#2C2C2C]/70 text-xs rounded font-medium">
                            {getCategoryDisplayName(notice.category)}
                          </span>
                          {canManage && notice.status !== 'PUBLISHED' && (
                            <span className={`px-2 py-0.5 text-xs rounded font-medium ${getStatusBadgeColor(notice.status)}`}>
                              {getStatusDisplayName(notice.status)}
                            </span>
                          )}
                          <h3 className="text-base font-semibold text-[#2C2C2C] group-hover:text-[#C84630] transition-colors truncate flex-1">
                            {notice.title}
                          </h3>
                        </div>

                        {/* 메타 정보 */}
                        <div className="flex items-center gap-3 text-xs text-[#2C2C2C]/40">
                          <span>{notice.authorName}</span>
                          <span>{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</span>
                          <span>조회 {notice.viewCount}</span>
                        </div>
                      </div>

                      {/* 오른쪽: 관리자 버튼 */}
                      {canManage && (
                        <div className="hidden sm:flex gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/notice/write?id=${notice.id}`);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2C2C2C] text-[#F4F4F0] hover:bg-[#C84630] hover:text-[#F4F4F0] transition-colors shadow-lg"
                            title="수정"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notice.id, notice.title);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2C2C2C]/90 text-[#F4F4F0] hover:bg-red-600 hover:text-[#F4F4F0] transition-colors shadow-lg"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer text-[#2C2C2C] hover:text-[#C84630]'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer ${currentPage === page ? 'bg-[#C84630] text-white' : 'text-[#2C2C2C] hover:text-[#C84630]'}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer text-[#2C2C2C] hover:text-[#C84630]'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              {/* 페이지 직접 입력 */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="text-[#2C2C2C]/50 text-sm">페이지 이동:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const page = parseInt(pageInput);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                        setPageInput('');
                      }
                    }
                  }}
                  placeholder={`1-${totalPages}`}
                  className="w-20 px-3 py-2 bg-white border border-[#2C2C2C]/10 rounded-lg text-[#2C2C2C] text-center focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                />
                <button
                  onClick={() => {
                    const page = parseInt(pageInput);
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page);
                      setPageInput('');
                    }
                  }}
                  className="px-4 py-2 bg-[#C84630] text-white rounded-lg hover:bg-[#A83820] transition-colors text-sm font-medium"
                >
                  이동
                </button>
              </div>

              {/* 총 결과 개수 */}
              <div className="mt-4 text-center text-[#2C2C2C]/60 text-sm">
                총 {totalCount}개의 공지사항
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}