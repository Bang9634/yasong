import { NoticeForm } from './components/NoticeForm';
import { useNoticeEditor } from './hooks/useNoticeEditor';
import { useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';

export function NoticeEditorPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const noticeId = searchParams.get('id');
  const isEdit = !!noticeId;

  const onCancel = useCallback(() => navigate('/notice'), [navigate]);
  const {
    formData,
    setFormData,
    isSubmitting,
    isLoading,
    attachments,
    uploadingFile,
    uploadingImage,
    pendingFiles,
    contentRef,
    handleImageUpload,
    handleAddPendingFile,
    handleRemovePendingFile,
    handleFileUpload,
    handleDeleteAttachment,
    handleSubmit,
  } = useNoticeEditor(noticeId, !!user && isManagerOrAbove(user.role), onCancel);

  // 권한 확인
  useEffect(() => {
    if (loading) return;

    if (!user || !isManagerOrAbove(user.role)) {
      alert('접근 권한이 없습니다.');
      navigate('/notice');
    }
  }, [user, loading, navigate]);

  if (loading || !user || !isManagerOrAbove(user.role)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
        <Header />
        <div className="pt-24 pb-12 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#2C2C2C]/60">로딩 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />

      <div className="pt-24 pb-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] tracking-tight mb-2">
              {isEdit ? '공지사항 수정' : '공지사항 작성'}
            </h1>
            <p className="text-[#2C2C2C]/70">
              {isEdit ? '공지사항을 수정합니다.' : '새로운 공지사항을 작성합니다.'}
            </p>
          </div>

          {/* 작성 폼 */}
          <div className="bg-white border border-[#2C2C2C]/10 rounded-lg p-8">
            <NoticeForm
              handleSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
              uploadingImage={uploadingImage}
              handleImageUpload={handleImageUpload}
              contentRef={contentRef}
              isEdit={isEdit}
              noticeId={noticeId}
              uploadingFile={uploadingFile}
              handleFileUpload={handleFileUpload}
              handleAddPendingFile={handleAddPendingFile}
              pendingFiles={pendingFiles}
              handleRemovePendingFile={handleRemovePendingFile}
              attachments={attachments}
              handleDeleteAttachment={handleDeleteAttachment}
              isSubmitting={isSubmitting}
              onCancel={onCancel}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
