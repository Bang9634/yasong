import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { photoAPI, getFullImageUrl } from '@/utils/api';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
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
} from '@/components/ui/pagination';

interface Photo {
  id: number;
  title: string;
  imageUrl: string;
  createdAt: string;
}

export function PhotoPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const itemsPerPage = 10;
  const isAdmin = user && isManagerOrAbove(user.role);

  useEffect(() => {
    setPageSEO({
      title: '사진 자료',
      description: '야송 이원좌의 소중한 사진 자료를 만나보세요',
      keywords: '야송, 이원좌, 사진, 자료, 아카이브',
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
  }, [photos]);

  // 서버로부터 사진 자료 로드
  const loadPhotos = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      console.log('📡 사진 자료 로드 파라미터:', params);
      const response = await photoAPI.getPhotos(params);
      console.log('✅ 사진 자료 응답:', response);
      
      setPhotos(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalCount(response.totalElements || 0);
    } catch (error) {
      console.error('Failed to load photos:', error);
      setPhotos([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // 페이지, 검색 변경 시 데이터 재로드
  useEffect(() => {
    setVisibleCards(new Set());
    loadPhotos();
  }, [currentPage, searchQuery]);

  // 검색어 변경 시 1페이지로 리셋
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  // 페이지 변경 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await photoAPI.deletePhoto(id);
      alert('사진 자료가 삭제되었습니다.');
      loadPhotos();
    } catch (error) {
      console.error('Failed to delete photo:', error);
      alert('사진 자료 삭제에 실패했습니다.');
    }
  };

  const getImageUrl = (imageUrl: string) => {
    return getFullImageUrl(imageUrl);
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
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] tracking-tight mb-2">사진 자료</h1>
              <p className="text-[#2C2C2C]/70">소중한 순간들을 만나보세요</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => navigate('/photos/write')}
                className="px-6 py-2 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                사진 추가
              </button>
            )}
          </div>

          {/* 검색창 */}
          <div className="mb-8">
            <div className="max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C2C2C]/40 w-4 h-4" />
              <input
                type="text"
                placeholder="제목으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#2C2C2C]/10 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#2C2C2C] placeholder:text-[#2C2C2C]/40"
              />
            </div>
          </div>

          {/* 사진 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="text-[#2C2C2C] text-lg">로딩 중...</div>
              </div>
            ) : !photos || photos.length === 0 ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="text-[#2C2C2C]/60 text-lg">사진 자료가 없습니다.</div>
              </div>
            ) : (
              photos.map((photo, index) => (
                <div
                  key={photo.id}
                  data-card-id={photo.id}
                  className={`group transition-all duration-700 ${
                    visibleCards.has(photo.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* 사진 이미지 */}
                  <div 
                    className="relative overflow-hidden flex justify-center h-[300px] items-end mb-0 cursor-pointer"
                    onClick={() => navigate(`/photos/${photo.id}`)}
                  >
                    <ImageWithFallback
                      src={getImageUrl(photo.imageUrl)}
                      alt={photo.title}
                      className="w-[90%] max-h-full object-contain group-hover:opacity-90 transition-opacity duration-300"
                    />
                    
                    {/* 관리자 버튼 */}
                    {isAdmin && (
                      <div className="absolute top-2 left-2 flex gap-1 opacity-70 hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/photos/edit/${photo.id}`);
                          }}
                          className="w-8 h-8 bg-[#F4F4F0] text-[#2C2C2C] rounded-full hover:bg-[#C84630] hover:text-[#F4F4F0] transition-colors flex items-center justify-center shadow-lg"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(photo.id);
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
                    className="flex flex-col cursor-pointer"
                    onClick={() => navigate(`/photos/${photo.id}`)}
                  >
                    {/* 제목 */}
                    <h3 className="text-xl font-bold text-[#2C2C2C] group-hover:text-[#C84630] transition-colors line-clamp-2 mb-2">
                      {photo.title}
                    </h3>
                    
                    {/* 날짜 */}
                    <p className="text-sm text-[#2C2C2C]/60">
                      {formatDate(photo.createdAt)}
                    </p>
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
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
