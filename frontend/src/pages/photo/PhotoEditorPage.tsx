import { PhotoForm } from './components/PhotoForm';
import { usePhotoEditor } from './hooks/usePhotoEditor';
import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { setPageSEO } from '@/utils/seo';

export function PhotoEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const canManage = user && isManagerOrAbove(user.role);

  const onDone = useCallback(() => navigate('/photos'), [navigate]);
  const {
    formData,
    imagePreview,
    isLoading,
    errors,
    handleInputChange,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
    fetchPhoto,
  } = usePhotoEditor(id, onDone);

  useEffect(() => {
    if (!canManage) {
      alert('권한이 없습니다.');
      navigate('/photos');
      return;
    }

    if (isEditMode && id) {
      fetchPhoto();
    }

    setPageSEO({
      title: isEditMode ? '사진 수정' : '사진 추가',
      description: '야송 사진 자료 관리',
    });
  }, [id, canManage]);

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate('/photos')}
          className="flex items-center gap-2 text-[#2C2C2C]/60 hover:text-[#C84630] transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>사진 목록으로</span>
        </button>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-2 tracking-tight">
            {isEditMode ? '사진 수정' : '사진 추가'}
          </h1>
          <p className="text-lg text-[#2C2C2C]/70">
            {isEditMode ? '사진 자료 정보를 수정합니다' : '새로운 사진 자료를 등록합니다'}
          </p>
        </div>

        {/* 폼 */}
        <PhotoForm
          handleSubmit={handleSubmit}
          imagePreview={imagePreview}
          handleRemoveImage={handleRemoveImage}
          handleImageChange={handleImageChange}
          errors={errors}
          formData={formData}
          handleInputChange={handleInputChange}
          onCancel={onDone}
          isLoading={isLoading}
          isEditMode={isEditMode}
        />
      </main>

      <Footer />
    </div>
  );
}
