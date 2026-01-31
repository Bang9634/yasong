import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { collectionAPI, getFullImageUrl } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';
import { Header } from './Header';
import { Footer } from './Footer';
import { Search, Plus, X, Edit2, Trash2, Pin, PinOff, ChevronRight, ChevronLeft } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/pagination';

interface Collection {
  id: number;
  title: string;
  year: string;
  size: string;
  imageUrl: string;
  description: string;
  artist: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export function CollectionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // SEO 설정
  useEffect(() => {
    setPageSEO({
      title: '작품 소개',
      description: '야송 이원좌 화백의 여러 작품을 감상할 수 있습니다.',
      keywords: '야송, 이원좌, 미술작품, 컬렉션',
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
  }, [collections]);

  // 서버로부터 소장품 로드
  const loadCollections = async () => {
    try {
      setLoading(true);
      
      // 연도 필터 범위 계산
      let yearFrom: string | undefined;
      let yearTo: string | undefined;
      
      if (yearFilter !== '전체') {
        switch (yearFilter) {
          case '1980년 이전':
            yearTo = '1979';
            break;
          case '1980-1989년':
            yearFrom = '1980';
            yearTo = '1989';
            break;
          case '1990-1994년':
            yearFrom = '1990';
            yearTo = '1994';
            break;
          case '1995-1999년':
            yearFrom = '1995';
            yearTo = '1999';
            break;
          case '2000-2004년':
            yearFrom = '2000';
            yearTo = '2004';
            break;
          case '2005-2019년':
            yearFrom = '2005';
            yearTo = '2019';
            break;
        }
      }

      const response = await collectionAPI.getCollections({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        yearFrom,
        yearTo,
      });
      
      console.log('🔍 [CollectionsPage] API Response:', response);
      
      // Spring Page 객체 처리 (content, totalPages, totalElements)
      const data = response.data || response.content || [];
      const pages = response.totalPages || 1;
      const total = response.total || response.totalElements || 0;
      
      setCollections(data);
      setTotalPages(pages);
      setTotalCount(total);
    } catch (error) {
      console.error('Failed to load collections:', error);
      // 에러 발생 시 빈 배열로 초기화
      setCollections([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // 페이지, 검색, 필터 변경 시 데이터 재로드
  useEffect(() => {
    setVisibleCards(new Set()); // 애니메이션 초기화
    loadCollections();
  }, [currentPage, searchQuery, yearFilter]);

  // 검색어나 필터 변경 시 1페이지로 리셋
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, yearFilter]);

  // 페이지 변경 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (collection: Collection) => {
    setCurrentCollection(collection);
    setTitle(collection.title);
    setYear(collection.year);
    setSize(collection.size);
    setDescription(collection.description);
    setArtist(collection.artist);
    setIsPinned(collection.isPinned);
    setImagePreview(getFullImageUrl(collection.imageUrl));
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setYear('');
    setSize('');
    setDescription('');
    setArtist('');
    setIsPinned(false);
    setImageFile(null);
    setImagePreview('');
    setCurrentCollection(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !year || !size || !description || !artist) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!isEditing && !imageFile) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      const data = {
        title,
        year,
        size,
        description,
        artist,
        isPinned,
      };

      if (isEditing && currentCollection) {
        await collectionAPI.updateCollection(String(currentCollection.id), data, imageFile || undefined);
        alert('작품이 수정되었습니다.');
      } else {
        await collectionAPI.createCollection(data, imageFile!);
        alert('작품이 추가되었습니다.');
      }

      closeModal();
      loadCollections();
    } catch (error: any) {
      console.error('Failed to save collection:', error);
      alert(error.message || '작품 저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await collectionAPI.deleteCollection(String(id));
      alert('작품이 삭제되었습니다.');
      loadCollections();
    } catch (error) {
      console.error('Failed to delete collection:', error);
      alert('작품 삭제에 실패했습니다.');
    }
  };

  const isAdmin = user && isManagerOrAbove(user.role);

  return (
    <div className="min-h-screen bg-[#2C2C2C] flex flex-col">
      <Header />
      
      <div className="pt-24 pb-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F4F0] tracking-tight mb-2">작품 소개</h1>
              <p className="text-[#F4F4F0]/70">야송 이원좌 화백의 작품을 확인할 수 있습니다.</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => navigate('/admin/collections/new')}
                className="px-6 py-2 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                작품 추가
              </button>
            )}
          </div>

          {/* 검색창 */}
          <div className="mb-8">
            <div className="max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F4F4F0]/40 w-4 h-4" />
              <input
                type="text"
                placeholder="작품명, 작가, 제작년도로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0] placeholder:text-[#F4F4F0]/40"
              />
            </div>
          </div>

          {/* 연도별 탭 */}
          <div className="mb-8 border-b border-[#F4F4F0]/20">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {['전체', '1980년 이전', '1980-1989년', '1990-1994년', '1995-1999년', '2000-2004년', '2005-2019년'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setYearFilter(tab)}
                  className={`
                    pb-3 px-2 font-medium transition-all whitespace-nowrap relative
                    ${yearFilter === tab 
                      ? 'text-[#C84630]' 
                      : 'text-[#F4F4F0]/60 hover:text-[#F4F4F0]'}
                  `}
                >
                  {tab}
                  {yearFilter === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 소장품 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="text-[#F4F4F0] text-lg">로딩 중...</div>
              </div>
            ) : !collections || collections.length === 0 ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="text-[#F4F4F0]/60 text-lg">작품이 없습니다.</div>
              </div>
            ) : (
              collections.map((collection, index) => (
              <div
                key={collection.id}
                data-card-id={collection.id}
                className={`group transition-all duration-700 ${
                  visibleCards.has(collection.id)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* 작품 이미지 */}
                <div 
                  className="relative overflow-hidden flex justify-center h-[300px] items-end mb-0 cursor-pointer"
                  onClick={() => navigate(`/collections/${collection.id}`)}
                >
                  <ImageWithFallback
                    src={getFullImageUrl(collection.imageUrl)}
                    alt={collection.title}
                    className="w-[90%] max-h-full object-contain group-hover:opacity-90 transition-opacity duration-300"
                  />
                  {collection.isPinned && (
                    <div className="absolute top-2 right-2 bg-[#C84630] text-[#F4F4F0] px-3 py-1 rounded-full flex items-center text-xs">
                      <Pin className="w-3 h-3 mr-1" />
                      고정
                    </div>
                  )}
                  
                  {/* 관리자 버튼 */}
                  {isAdmin && (
                    <div className="absolute top-2 left-2 flex gap-1 opacity-70 hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/collections/edit/${collection.id}`);
                        }}
                        className="w-8 h-8 bg-[#F4F4F0] text-[#2C2C2C] rounded-full hover:bg-[#C84630] hover:text-[#F4F4F0] transition-colors flex items-center justify-center shadow-lg"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(collection.id);
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
                  className="flex flex-col min-h-[180px] cursor-pointer"
                  onClick={() => navigate(`/collections/${collection.id}`)}
                >
                  {/* 작가 */}
                  <div className="text-xs text-[#F4F4F0]/60 font-medium mb-2">
                    {collection.artist}
                  </div>
                  
                  {/* 제목 */}
                  <h3 className="text-xl font-bold text-[#F4F4F0] group-hover:text-[#C84630] transition-colors line-clamp-2 mb-3">
                    {collection.title}
                  </h3>
                  
                  {/* 설명 */}
                  <p className="text-sm text-[#F4F4F0]/70 leading-relaxed line-clamp-3 mb-4">
                    {collection.description}
                  </p>
                  
                  {/* 하단 고정 영역 */}
                  <div className="mt-auto space-y-2">
                    {/* 제작 연도 및 크기 */}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1 bg-[#F4F4F0] text-[#2C2C2C] text-xs rounded-full">
                        {collection.year}
                      </span>
                      <span className="inline-block px-3 py-1 bg-[#F4F4F0]/20 text-[#F4F4F0] text-xs rounded-full">
                        {collection.size}
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
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer text-[#F4F4F0] hover:text-[#C84630]'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer ${currentPage === page ? 'bg-[#C84630] text-[#F4F4F0]' : 'text-[#F4F4F0] hover:text-[#C84630]'}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer text-[#F4F4F0] hover:text-[#C84630]'}
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
                  className="px-4 py-2 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors text-sm font-medium"
                >
                  이동
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#2C2C2C]">
                {isEditing ? '작품 수정' : '작품 추가'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  작품명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  작가 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제작년도 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                    placeholder="예: 1985"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    크기 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                    placeholder="예: 45.5 x 53cm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 {!isEditing && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                  required={!isEditing}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-lg" />
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-[#C84630] border-gray-300 rounded focus:ring-[#C84630]"
                />
                <label htmlFor="isPinned" className="ml-2 text-sm text-gray-700">
                  홈페이지 대표 작품으로 고정
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#C84630] text-white rounded-lg hover:bg-[#A83820] transition-colors"
                >
                  {isEditing ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
