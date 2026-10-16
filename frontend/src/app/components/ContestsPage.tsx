import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { contestAPI, getFullImageUrl } from '@/utils/api';
import { Calendar, MapPin, Plus, Search, Edit2, Trash2, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { setPageSEO } from '@/utils/seo';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/pagination';

interface Contest {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  host: string;
  description: string;
  announcementUrl: string;
  startDate: string;
  endDate: string;
  status: 'ONGOING' | 'UPCOMING' | 'PAST';
  createdAt: string;
  updatedAt: string;
}

export function ContestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contests, setContests] = useState<Contest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const itemsPerPage = 10;
  const isAdmin = user && isManagerOrAbove(user.role);

  useEffect(() => {
    setPageSEO({
      title: '공모전',
      description: '청송에서 개최하는 미술 공모전 정보를 확인하세요',
      keywords: '야송, 공모전, 미술 공모전, 미술대회',
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
  }, [contests]);

  // 서버로부터 공모전 로드
  const loadContests = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (statusFilter !== '전체') {
        const statusMap: { [key: string]: string } = {
          '진행 중': 'ongoing',
          '진행 예정': 'upcoming',
          '종료됨': 'past',
        };
        params.status = statusMap[statusFilter];
      }

      console.log('📡 공모전 로드 파라미터:', params);
      const response = await contestAPI.getContests(params);
      console.log('✅ 공모전 응답:', response);
      
      setContests(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalCount(response.totalElements || 0);
    } catch (error) {
      console.error('Failed to load contests:', error);
      setContests([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // 페이지, 검색, 필터 변경 시 데이터 재로드
  useEffect(() => {
    setVisibleCards(new Set());
    loadContests();
  }, [currentPage, searchQuery, statusFilter]);

  // 검색어나 필터 변경 시 1페이지로 리셋
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, statusFilter]);

  // 페이지 변경 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await contestAPI.deleteContest(id);
      alert('공모전이 삭제되었습니다.');
      loadContests();
    } catch (error) {
      console.error('Failed to delete contest:', error);
      alert('공모전 삭제에 실패했습니다.');
    }
  };

  const getImageUrl = (imageUrl: string) => {
    return getFullImageUrl(imageUrl);
  };

  const getStatusDisplayName = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ONGOING': '진행 중',
      'UPCOMING': '진행 예정',
      'PAST': '종료됨',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'ONGOING': 'bg-green-600',
      'UPCOMING': 'bg-orange-500',
      'PAST': 'bg-gray-600',
    };
    return colorMap[status] || 'bg-gray-600';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleCardClick = (contest: Contest) => {
    navigate(`/contests/${contest.id}`);
  };

  return (
    <div className="min-h-screen bg-[#2C2C2C] flex flex-col">
      <Header />
      
      <div className="pt-24 pb-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F4F0] tracking-tight mb-2">공모전</h1>
              <p className="text-[#F4F4F0]/70">미술 공모전 정보</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => navigate('/contests/write')}
                className="px-6 py-2 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                공모전 추가
              </button>
            )}
          </div>

          {/* 검색창 */}
          <div className="mb-8">
            <div className="max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F4F4F0]/40 w-4 h-4" />
              <input
                type="text"
                placeholder="공모전명, 주최자, 대상으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0] placeholder:text-[#F4F4F0]/40"
              />
            </div>
          </div>

          {/* 공모전 진행 여부 탭 */}
          <div className="mb-8 border-b border-[#F4F4F0]/20">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {['전체', '진행 중', '진행 예정', '종료됨'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`
                    pb-3 px-2 font-medium transition-all whitespace-nowrap relative
                    ${statusFilter === tab 
                      ? 'text-[#C84630]' 
                      : 'text-[#F4F4F0]/60 hover:text-[#F4F4F0]'}
                  `}
                >
                  {tab}
                  {statusFilter === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 공모전 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="text-[#F4F4F0] text-lg">로딩 중...</div>
              </div>
            ) : !contests || contests.length === 0 ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="text-[#F4F4F0]/60 text-lg">공모전이 없습니다.</div>
              </div>
            ) : (
              contests.map((contest, index) => (
                <div
                  key={contest.id}
                  data-card-id={contest.id}
                  className={`group transition-all duration-700 ${
                    visibleCards.has(contest.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* 공모전 이미지 */}
                  <div 
                    className="relative overflow-hidden flex justify-center mb-0 cursor-pointer"
                    onClick={() => handleCardClick(contest)}
                  >
                    <ImageWithFallback
                      src={getImageUrl(contest.imageUrl)}
                      alt={contest.title}
                      className="w-[80%] aspect-[3/4] object-cover group-hover:opacity-90 transition-opacity duration-300"
                    />
                    
                    {/* 상태 배지 */}
                    <div className={`absolute top-2 right-2 ${getStatusColor(contest.status)} text-white px-3 py-1 rounded-full text-xs`}>
                      {getStatusDisplayName(contest.status)}
                    </div>
                    
                    {/* 관리자 버튼 */}
                    {isAdmin && (
                      <div className="absolute top-2 left-2 flex gap-1 opacity-70 hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/contests/edit/${contest.id}`);
                          }}
                          className="w-8 h-8 bg-[#F4F4F0] text-[#2C2C2C] rounded-full hover:bg-[#C84630] hover:text-[#F4F4F0] transition-colors flex items-center justify-center shadow-lg"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(contest.id);
                          }}
                          className="w-8 h-8 bg-[#F4F4F0]/90 text-[#2C2C2C] rounded-full hover:bg-red-600 hover:text-[#F4F4F0] transition-colors flex items-center justify-center shadow-lg"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* 구분선 */}
                  <div className="w-full h-px bg-[#F4F4F0]/20 mb-4"></div>
                  
                  {/* 텍스트 정보 */}
                  <div 
                    className="flex flex-col h-[180px] cursor-pointer"
                    onClick={() => handleCardClick(contest)}
                  >
                    {/* 제목 */}
                    <h3 className="text-xl font-bold text-[#F4F4F0] group-hover:text-[#C84630] transition-colors line-clamp-2 mb-2 h-[3.5rem]">
                      {contest.title}
                    </h3>
                    
                    {/* 설명 */}
                    <p className="text-sm text-[#F4F4F0]/70 leading-relaxed line-clamp-2 mb-3 h-[2.75rem]">
                      {contest.description}
                    </p>
                    
                    {/* 하단 고정 영역 */}
                    <div className="mt-auto space-y-2">
                      {/* 공모전 기간 */}
                      <div className="flex items-center gap-1 text-xs text-[#F4F4F0]/60">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(contest.startDate)} ~ {formatDate(contest.endDate)}</span>
                      </div>
                      
                      {/* 주최자 */}
                      <div className="flex items-center gap-1 text-xs text-[#F4F4F0]/60">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{contest.host}</span>
                      </div>
                      
                      {/* 공모 대상 */}
                      <div className="flex items-center gap-1 text-xs text-[#F4F4F0]/60 mb-2">
                        <User className="w-3 h-3" />
                        <span className="line-clamp-1">{contest.location}</span>
                      </div>
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
                      className={currentPage === 1 ? 'pointer-events-none text-[#F4F4F0]/20' : 'cursor-pointer text-[#F4F4F0] hover:text-[#C84630]'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer ${currentPage === page ? 'bg-[#C84630] text-white' : 'text-[#F4F4F0] hover:text-[#C84630]'}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none text-[#F4F4F0]/20' : 'cursor-pointer text-[#F4F4F0] hover:text-[#C84630]'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              {/* 페이지 직접 입력 */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="text-[#F4F4F0]/70 text-sm">페이지 이동:</span>
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
                  className="w-20 px-3 py-2 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg text-[#F4F4F0] text-center focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
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
              <div className="mt-4 text-center text-[#F4F4F0]/60 text-sm">
                총 {totalCount}개의 공모전
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
