import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { updateLogAPI } from '@/utils/api';
import { setPageSEO } from '@/utils/seo';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/pagination';

interface UpdateLogItem {
  id: number;
  title: string;
  version: string;
  updateDate: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function UpdateLogsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState<UpdateLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const itemsPerPage = 10;

  const canManage = user && isManagerOrAbove(user.role);

  useEffect(() => {
    setPageSEO({
      title: '업데이트 내역',
      description: '야송 웹사이트의 업데이트 내역을 확인하실 수 있습니다.',
      keywords: '야송 업데이트, 버전 정보, 업데이트 내역',
    });
  }, []);

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
  }, [logs]);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const response = await updateLogAPI.getUpdateLogs({
        page: currentPage,
        limit: itemsPerPage,
      });

      setLogs(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalCount(response.totalElements || 0);
    } catch (error) {
      console.error('업데이트 내역 조회 실패:', error);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [currentPage]);

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`"${title}" 업데이트 내역을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await updateLogAPI.deleteUpdateLog(id.toString());
      alert('업데이트 내역이 삭제되었습니다.');
      loadLogs();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#2C2C2C]/60">로딩 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#C84630]" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] tracking-tight">
                업데이트 내역
              </h1>
              <p className="text-[#2C2C2C]/70 mt-2">
                총 {totalCount}개의 업데이트
              </p>
            </div>
          </div>
          
          {canManage && (
            <button
              onClick={() => navigate('/updates/write')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#C84630] text-white rounded-lg hover:bg-[#A33520] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>작성하기</span>
            </button>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-[#2C2C2C]/20 mb-8"></div>

        {/* 업데이트 내역 목록 */}
        {logs.length === 0 ? (
          <div className="text-center py-12 text-[#2C2C2C]/60">
            등록된 업데이트 내역이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div
                key={log.id}
                data-card-id={log.id}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group ${
                  visibleCards.has(log.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/updates/${log.id}`)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-base font-semibold text-[#2C2C2C] group-hover:text-[#C84630] transition-colors truncate">
                          {log.title}
                        </h2>
                          <span className="px-2 py-0.5 bg-[#C84630] text-white text-xs rounded font-medium whitespace-nowrap">
                          v{log.version}
                        </span>
                      </div>
                      
                        <div className="flex items-center gap-3 text-xs text-[#2C2C2C]/40">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(log.updateDate).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>

                      <p className="text-[#2C2C2C]/70 line-clamp-2">
                        {log.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                        {log.content.length > 150 ? '...' : ''}
                      </p>
                    </div>

                    {canManage && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/updates/write?id=${log.id}`);
                          }}
                          className="p-2 rounded-lg bg-[#2C2C2C] hover:bg-[#2C2C2C]/90 transition-colors text-[#F4F4F0]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(log.id, log.title);
                          }}
                          className="p-2 rounded-lg bg-[#C84630] hover:bg-[#A83820] transition-colors text-[#F4F4F0]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {renderPaginationItems()}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
