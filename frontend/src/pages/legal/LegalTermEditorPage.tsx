import { LegalTermForm } from './components/LegalTermForm';
import { useLegalTermEditor } from './hooks/useLegalTermEditor';
import { useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { ChevronLeft } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';

export function LegalTermEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const canManage = user && isManagerOrAbove(user.role);

  const onCancel = useCallback(() => navigate('/admin/legal'), [navigate]);
  const { formData, isLoading, errors, fetchTerm, handleInputChange, handleSubmit } =
    useLegalTermEditor(id, searchParams.get('type'), onCancel);

  useEffect(() => {
    if (!canManage) {
      alert('권한이 없습니다.');
      navigate('/');
      return;
    }

    if (isEditMode && id) {
      fetchTerm();
    }

    setPageSEO({
      title: isEditMode ? '약관 수정' : '약관 추가',
      description: '야송미술관 약관 관리',
    });
  }, [id, canManage]);

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-[#2C2C2C]/60 hover:text-[#C84630] transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>관리 페이지로</span>
        </button>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-2 tracking-tight">
            {isEditMode ? '약관 수정' : '약관 추가'}
          </h1>
          <p className="text-lg text-[#2C2C2C]/70">
            {isEditMode ? '약관 정보를 수정합니다' : '새로운 약관을 등록합니다'}
          </p>
        </div>

        {/* 폼 */}
        <LegalTermForm
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          isEditMode={isEditMode}
          errors={errors}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      </main>

      <Footer />
    </div>
  );
}
