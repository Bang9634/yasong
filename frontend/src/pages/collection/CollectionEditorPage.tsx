import { CollectionForm } from './components/CollectionForm';
import { useCollectionEditor } from './hooks/useCollectionEditor';
import { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';

export function CollectionEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const onCancel = useCallback(() => navigate('/collections'), [navigate]);
  const {
    loading,
    loadCollection,
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
    setImageFile,
    imagePreview,
    setImagePreview,
  } = useCollectionEditor(id, onCancel);

  // 권한 체크
  useEffect(() => {
    if (!user || !isManagerOrAbove(user.role)) {
      alert('접근 권한이 없습니다.');
      navigate('/collections');
      return;
    }

    if (isEditing && id) {
      loadCollection(parseInt(id));
    }

    setPageSEO({
      title: isEditing ? '소장품 수정' : '소장품 추가',
      description: '야송 소장품 관리',
      keywords: '야송, 소장품, 관리',
    });
  }, [id, user, navigate, isEditing]);

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-[#2C2C2C]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-[#F4F4F0] text-xl">로딩 중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C2C2C] flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onCancel}
          className="mb-8 flex items-center gap-2 text-[#F4F4F0] hover:text-[#C84630] transition-colors text-lg font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>목록으로 돌아가기</span>
        </button>

        {/* 페이지 제목 */}
        <h1 className="text-4xl font-bold text-[#F4F4F0] mb-8">
          {isEditing ? '소장품 수정' : '소장품 추가'}
        </h1>

        {/* 폼 */}
        <CollectionForm
          handleSubmit={handleSubmit}
          imagePreview={imagePreview}
          setImageFile={setImageFile}
          setImagePreview={setImagePreview}
          handleImageChange={handleImageChange}
          artist={artist}
          setArtist={setArtist}
          title={title}
          setTitle={setTitle}
          year={year}
          setYear={setYear}
          size={size}
          setSize={setSize}
          description={description}
          setDescription={setDescription}
          isPinned={isPinned}
          setIsPinned={setIsPinned}
          onCancel={onCancel}
          loading={loading}
          isEditing={isEditing}
        />
      </main>

      <Footer />
    </div>
  );
}
