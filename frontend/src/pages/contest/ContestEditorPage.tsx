import { ContestForm } from './components/ContestForm';
import { useContestEditor } from './hooks/useContestEditor';
import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { setPageSEO } from '@/utils/seo';

export function ContestEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const canManage = user && isManagerOrAbove(user.role);

  const onDone = useCallback(() => navigate('/contests'), [navigate]);
  const {
    formData,
    imagePreview,
    isLoading,
    errors,
    handleInputChange,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
    fetchContest,
    attachments,
    pendingFiles,
    uploadingFile,
    handleAddPendingFile,
    handleRemovePendingFile,
    handleUploadFile,
    handleDeleteAttachment,
  } = useContestEditor(id, onDone);

  useEffect(() => {
    if (!canManage) {
      alert('권한이 없습니다.');
      navigate('/contests');
      return;
    }

    if (isEditMode && id) {
      fetchContest();
    }

    setPageSEO({
      title: isEditMode ? '공모전 수정' : '공모전 추가',
      description: '공모전 관리',
    });
  }, [id, canManage]);

  return (
    <div className="min-h-screen bg-[#2C2C2C] flex flex-col">
      <Header />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate('/contests')}
          className="flex items-center gap-2 text-[#F4F4F0]/60 hover:text-[#C84630] transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>공모전 목록으로</span>
        </button>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F4F4F0] mb-2 tracking-tight">
            {isEditMode ? '공모전 수정' : '공모전 추가'}
          </h1>
          <p className="text-lg text-[#F4F4F0]/70">
            {isEditMode ? '공모전 정보를 수정합니다' : '새로운 공모전을 등록합니다'}
          </p>
        </div>

        {/* 폼 */}
        <ContestForm
          handleSubmit={handleSubmit}
          imagePreview={imagePreview}
          handleRemoveImage={handleRemoveImage}
          handleImageChange={handleImageChange}
          errors={errors}
          formData={formData}
          handleInputChange={handleInputChange}
          attachments={attachments}
          pendingFiles={pendingFiles}
          uploadingFile={uploadingFile}
          isEditMode={isEditMode}
          id={id}
          handleAddPendingFile={handleAddPendingFile}
          handleRemovePendingFile={handleRemovePendingFile}
          handleUploadFile={handleUploadFile}
          handleDeleteAttachment={handleDeleteAttachment}
          onCancel={onDone}
          isLoading={isLoading}
        />
      </main>

      <Footer />
    </div>
  );
}
