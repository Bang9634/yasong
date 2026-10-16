import { CollectionGrid } from './components/CollectionGrid';
import { CollectionPagination } from './components/CollectionPagination';
import { CollectionFilters } from './components/CollectionFilters';
import { CollectionEditorModal } from './components/CollectionEditorModal';
import { useCollectionsList } from './hooks/useCollectionsList';
import { useCollectionModal } from './hooks/useCollectionModal';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Plus } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';

export function CollectionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    collections,
    searchQuery,
    setSearchQuery,
    yearFilter,
    setYearFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    loading,
    pageInput,
    setPageInput,
    visibleCards,
    handleDelete,
    loadCollections,
  } = useCollectionsList();
  const {
    isModalOpen,
    isEditing,
    closeModal,
    handleImageChange,
    handleSubmit,
    title,
    setTitle,
    year,
    setYear,
    size,
    setSize,
    description,
    setDescription,
    artist,
    setArtist,
    isPinned,
    setIsPinned,
    imagePreview,
  } = useCollectionModal(loadCollections);

  // SEO 설정
  useEffect(() => {
    setPageSEO({
      title: '작품 소개',
      description: '야송 이원좌 화백의 여러 작품을 감상할 수 있습니다.',
      keywords: '야송, 이원좌, 미술작품, 컬렉션',
    });
  }, []);

  const isAdmin = user && isManagerOrAbove(user.role);

  return (
    <div className="min-h-screen bg-[#2C2C2C] flex flex-col">
      <Header />
      <div className="pt-24 pb-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F4F0] tracking-tight mb-2">
                작품 소개
              </h1>
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
          <CollectionFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setYearFilter={setYearFilter}
            yearFilter={yearFilter}
          />
          {/* 소장품 그리드 */}
          <CollectionGrid
            loading={loading}
            collections={collections}
            visibleCards={visibleCards}
            onOpen={(id) => navigate(`/collections/${id}`)}
            onEdit={(id) => navigate(`/admin/collections/edit/${id}`)}
            isAdmin={isAdmin}
            handleDelete={handleDelete}
          />
          {/* 페이지네이션 */}
          <CollectionPagination
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            pageInput={pageInput}
            setPageInput={setPageInput}
            totalCount={totalCount}
          />
        </div>
      </div>
      {/* 모달 */}
      <CollectionEditorModal
        isModalOpen={isModalOpen}
        isEditing={isEditing}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        title={title}
        setTitle={setTitle}
        artist={artist}
        setArtist={setArtist}
        year={year}
        setYear={setYear}
        size={size}
        setSize={setSize}
        description={description}
        setDescription={setDescription}
        handleImageChange={handleImageChange}
        imagePreview={imagePreview}
        isPinned={isPinned}
        setIsPinned={setIsPinned}
      />
      <Footer />
    </div>
  );
}
