import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collectionAPI, getFullImageUrl } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';
import { Header } from './Header';
import { Footer } from './Footer';
import { Search, Plus, X, Edit2, Trash2, Pin, PinOff } from 'lucide-react';
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
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCollections(collections);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCollections(
        collections.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.artist.toLowerCase().includes(query) ||
            c.year.includes(query)
        )
      );
    }
    setCurrentPage(1); // 검색 시 1페이지로 리셋
  }, [searchQuery, collections]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCollections = filteredCollections.slice(startIndex, endIndex);

  // 페이지 변경 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const loadCollections = async () => {
    try {
      const data = await collectionAPI.getAllCollections();
      setCollections(data);
      setFilteredCollections(data);
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openDetailModal = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCollection(null);
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
        alert('소장품이 수정되었습니다.');
      } else {
        await collectionAPI.createCollection(data, imageFile!);
        alert('소장품이 추가되었습니다.');
      }

      closeModal();
      loadCollections();
    } catch (error: any) {
      console.error('Failed to save collection:', error);
      alert(error.message || '소장품 저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await collectionAPI.deleteCollection(String(id));
      alert('소장품이 삭제되었습니다.');
      loadCollections();
    } catch (error) {
      console.error('Failed to delete collection:', error);
      alert('소장품 삭제에 실패했습니다.');
    }
  };

  const isAdmin = user && isManagerOrAbove(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-teal-900 mb-2">소장품 목록</h1>
            <p className="text-gray-600">야송미술관의 소장품을 확인하실 수 있습니다.</p>
          </div>

          {/* 검색 및 추가 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="작품명, 작가, 제작년도로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            {isAdmin && (
              <button
                onClick={openCreateModal}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                소장품 추가
              </button>
            )}
          </div>

          {/* 소장품 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCollections.map((collection) => (
              <div key={collection.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative cursor-pointer" onClick={() => openDetailModal(collection)}>
                  <img
                    src={getFullImageUrl(collection.imageUrl)}
                    alt={collection.title}
                    className="w-full h-64 object-cover"
                  />
                  {collection.isPinned && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full flex items-center text-sm">
                      <Pin className="w-4 h-4 mr-1" />
                      고정
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="cursor-pointer" onClick={() => openDetailModal(collection)}>
                    <h3 className="text-xl font-bold text-teal-900 mb-2 hover:text-teal-700 transition-colors">{collection.title}</h3>
                    <p className="text-gray-600 mb-2">작가: {collection.artist}</p>
                    <p className="text-gray-600 mb-2">제작년도: {collection.year}</p>
                    <p className="text-gray-600 mb-4">크기: {collection.size}</p>
                    <p className="text-gray-700 text-sm line-clamp-3">{collection.description}</p>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => openEditModal(collection)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-teal-900">
                {isEditing ? '소장품 수정' : '소장품 추가'}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="isPinned" className="ml-2 text-sm text-gray-700">
                  홈페이지 대표 소장품으로 고정
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
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  {isEditing ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 상세보기 모달 */}
      {isDetailModalOpen && selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeDetailModal}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-teal-900">소장품 상세</h2>
              <button onClick={closeDetailModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* 이미지 */}
                <div className="relative">
                  <img
                    src={getFullImageUrl(selectedCollection.imageUrl)}
                    alt={selectedCollection.title}
                    className="w-full h-auto rounded-lg shadow-lg object-contain max-h-[500px]"
                  />
                  {selectedCollection.isPinned && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-full flex items-center">
                      <Pin className="w-5 h-5 mr-2" />
                      대표 소장품
                    </div>
                  )}
                </div>

                {/* 정보 */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-teal-900 mb-4">{selectedCollection.title}</h3>
                    <div className="space-y-3 text-gray-700">
                      <div className="flex items-start">
                        <span className="font-semibold min-w-[80px]">작가:</span>
                        <span>{selectedCollection.artist}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-semibold min-w-[80px]">제작년도:</span>
                        <span>{selectedCollection.year}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-semibold min-w-[80px]">크기:</span>
                        <span>{selectedCollection.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-lg text-teal-900 mb-3">작품 설명</h4>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedCollection.description}
                    </p>
                  </div>

                  {isAdmin && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            closeDetailModal();
                            openEditModal(selectedCollection);
                          }}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          수정
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('정말 삭제하시겠습니까?')) {
                              try {
                                await handleDelete(selectedCollection.id);
                                closeDetailModal();
                              } catch (error) {
                                console.error('삭제 실패:', error);
                              }
                            }
                          }}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          삭제
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
