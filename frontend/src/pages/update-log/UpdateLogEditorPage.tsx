import { UpdateLogForm } from './components/UpdateLogForm';
import { useUpdateLogEditor } from './hooks/useUpdateLogEditor';
import { useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { FileText } from 'lucide-react';

export function UpdateLogEditorPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const logId = searchParams.get('id');
  const isEdit = !!logId;

  const onDone = useCallback(() => navigate('/updates'), [navigate]);
  const { formData, setFormData, isSubmitting, isLoading, handleSubmit, handleCancel } =
    useUpdateLogEditor(logId, !!user && isManagerOrAbove(user.role), onDone);

  // 권한 확인
  useEffect(() => {
    if (loading) return;

    if (!user || !isManagerOrAbove(user.role)) {
      alert('접근 권한이 없습니다.');
      navigate('/updates');
    }
  }, [user, loading, navigate]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#2C2C2C]/60">로딩 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !isManagerOrAbove(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-[#C84630]" />
            <h1 className="text-4xl font-bold text-[#2C2C2C]">
              {isEdit ? '업데이트 내역 수정' : '업데이트 내역 작성'}
            </h1>
          </div>
          <p className="text-[#2C2C2C]/70">웹사이트의 업데이트 내용을 작성해주세요.</p>
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-[#2C2C2C]/20 mb-8"></div>

        {/* 폼 */}
        <UpdateLogForm
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          handleCancel={handleCancel}
          isSubmitting={isSubmitting}
          isEdit={isEdit}
        />
      </main>

      <Footer />
    </div>
  );
}
