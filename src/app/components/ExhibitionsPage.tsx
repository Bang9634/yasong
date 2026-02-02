import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { exhibitionAPI, getFullImageUrl } from '@/utils/api';
import { Calendar, MapPin, Plus, Search, Edit2, Trash2 } from 'lucide-react';
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

interface Exhibition {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
  type: 'MEMORIAL' | 'RETROSPECTIVE';
  startDate: string;
  endDate: string;
  status: 'ONGOING' | 'UPCOMING' | 'PAST';
  createdAt: string;
  updatedAt: string;
}

export function ExhibitionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('전체');
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
      title: '전시',
      description: '야송미술관의 과거, 현재, 그리고 미래의 전시를 만나보세요',
      keywords: '야송미술관, 전시, 추모전시, 회고전, 미술 전시',
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
  }, [exhibitions]);

  // 서버로부터 전시 로드
  const loadExhibitions = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (typeFilter !== '전체') {
        params.type = typeFilter === '추모 전시' ? 'MEMORIAL' : 'RETROSPECTIVE';
      }

      if (statusFilter !== '전체') {
        const statusMap: { [key: string]: string } = {
          '전시 중': 'ongoing',
          '전시 예정': 'upcoming',
          '지난 전시': 'past',
        };
        params.status = statusMap[statusFilter];
      }

      console.log('📡 전시 로드 파라미터:', params);
      const response = await exhibitionAPI.getExhibitions(params);
      console.log('✅ 전시 응답:', response);
      
      setExhibitions(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalCount(response.totalElements || 0);
    } catch (error) {
      console.error('Failed to load exhibitions:', error);
      setExhibitions([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // 페이지, 검색, 필터 변경 시 데이터 재로드
  useEffect(() => {
    setVisibleCards(new Set());
    loadExhibitions();
  }, [currentPage, searchQuery, typeFilter, statusFilter]);

  // 검색어나 필터 변경 시 1페이지로 리셋
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, typeFilter, statusFilter]);

  // 페이지 변경 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await exhibitionAPI.deleteExhibition(id);
      alert('전시가 삭제되었습니다.');
      loadExhibitions();
    } catch (error) {
      console.error('Failed to delete exhibition:', error);
      alert('전시 삭제에 실패했습니다.');
    }
  };

  const getImageUrl = (imageUrl: string) => {
    return getFullImageUrl(imageUrl);
  };

  const getTypeDisplayName = (type: string) => {
    return type === 'MEMORIAL' ? '추모 전시' : '회고전';
  };

  const getStatusDisplayName = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ONGOING': '전시 중',
      'UPCOMING': '전시 예정',
      'PAST': '지난 전시',
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

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      
      <div className="pt-24 pb-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] tracking-tight mb-2">전시</h1>
              <p className="text-[#2C2C2C]/70">과거, 현재, 그리고 미래의 전시를 만나보세요</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => navigate('/exhibitions/write')}
                className="px-6 py-2 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                전시 추가
              </button>
            )}
          </div>

          {/* 검색창 */}
          <div className="mb-8">
            <div className="max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C2C2C]/40 w-4 h-4" />
              <input
                type="text"
                placeholder="전시명, 작가명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#2C2C2C]/10 border border-[#2C2C2C]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#2C2C2C] placeholder:text-[#2C2C2C]/40"
              />
            </div>
          </div>

          {/* 전시 종류 탭 */}
          <div className="mb-6 border-b border-[#2C2C2C]/20">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {['전체', '추모 전시', '회고전'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTypeFilter(tab)}
                  className={`
                    pb-3 px-2 font-medium transition-all whitespace-nowrap relative
                    ${typeFilter === tab 
                      ? 'text-[#C84630]' 
                      : 'text-[#2C2C2C]/60 hover:text-[#2C2C2C]'}
                  `}
                >
                  {tab}
                  {typeFilter === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 전시 진행 여부 탭 */}
          <div className="mb-8 border-b border-[#2C2C2C]/20">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {['전체', '전시 중', '전시 예정', '지난 전시'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`
                    pb-3 px-2 font-medium transition-all whitespace-nowrap relative
                    ${statusFilter === tab 
                      ? 'text-[#C84630]' 
                      : 'text-[#2C2C2C]/60 hover:text-[#2C2C2C]'}
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

          {/* 전시 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="text-[#2C2C2C] text-lg">로딩 중...</div>
              </div>
            ) : !exhibitions || exhibitions.length === 0 ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="text-[#2C2C2C]/60 text-lg">전시가 없습니다.</div>
              </div>
            ) : (
              exhibitions.map((exhibition, index) => (
                <div
                  key={exhibition.id}
                  data-card-id={exhibition.id}
                  className={`group transition-all duration-700 ${
                    visibleCards.has(exhibition.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* 전시 이미지 */}
                  <div 
                    className="relative overflow-hidden flex justify-center mb-0 cursor-pointer"
                    onClick={() => navigate(`/exhibitions/${exhibition.id}`)}
                  >
                    <ImageWithFallback
                      src={getImageUrl(exhibition.imageUrl)}
                      alt={exhibition.title}
                      className="w-[80%] aspect-[3/4] object-cover group-hover:opacity-90 transition-opacity duration-300"
                    />
                    
                    {/* 상태 배지 */}
                    <div className={`absolute top-2 right-2 ${getStatusColor(exhibition.status)} text-white px-3 py-1 rounded-full text-xs`}>
                      {getStatusDisplayName(exhibition.status)}
                    </div>
                    
                    {/* 관리자 버튼 */}
                    {isAdmin && (
                      <div className="absolute top-2 left-2 flex gap-1 opacity-70 hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/exhibitions/edit/${exhibition.id}`);
                          }}
                          className="w-8 h-8 bg-[#F4F4F0] text-[#2C2C2C] rounded-full hover:bg-[#C84630] hover:text-[#F4F4F0] transition-colors flex items-center justify-center shadow-lg"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(exhibition.id);
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
                  <div className="w-full h-px bg-[#2C2C2C]/20 mb-4"></div>
                  
                  {/* 텍스트 정보 */}
                  <div 
                    className="flex flex-col h-[180px] cursor-pointer"
                    onClick={() => navigate(`/exhibitions/${exhibition.id}`)}
                  >
                    {/* 제목 */}
                    <h3 className="text-xl font-bold text-[#2C2C2C] group-hover:text-[#C84630] transition-colors line-clamp-2 mb-2 h-[3.5rem]">
                      {exhibition.title}
                    </h3>
                    
                    {/* 설명 */}
                    <p className="text-sm text-[#2C2C2C]/70 leading-relaxed line-clamp-2 mb-3 h-[2.75rem]">
                      {exhibition.description}
                    </p>
                    
                    {/* 하단 고정 영역 */}
                    <div className="mt-auto space-y-2">
                      {/* 전시 기간 */}
                      <div className="flex items-center gap-1 text-xs text-[#2C2C2C]/60">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(exhibition.startDate)} ~ {formatDate(exhibition.endDate)}</span>
                      </div>
                      
                      {/* 전시 장소 */}
                      <div className="flex items-center gap-1 text-xs text-[#2C2C2C]/60 mb-2">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{exhibition.location}</span>
                      </div>
                      
                      {/* 전시 종류 */}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block px-3 py-1 bg-[#2C2C2C] text-[#F4F4F0] text-xs rounded-full">
                          {getTypeDisplayName(exhibition.type)}
                        </span>
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
              <div className="mt-4 text-center text-[#F4F4F0]/60 text-sm">
                총 {totalCount}개의 전시
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
