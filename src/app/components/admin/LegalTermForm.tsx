import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { legalAPI } from '@/utils/api';
import { ChevronLeft } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';

interface FormData {
  type: 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY';
  version: string;
  content: string;
  startDate: string;
  endDate: string;
}

export function LegalTermForm() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const canManage = user && isManagerOrAbove(user.role);

  const [formData, setFormData] = useState<FormData>({
    type: (searchParams.get('type') as 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY') || 'TERMS_OF_SERVICE',
    version: '',
    content: '',
    startDate: '',
    endDate: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const fetchTerm = async () => {
    try {
      const data = await legalAPI.getTermById(parseInt(id!));
      setFormData({
        type: data.type,
        version: data.version,
        content: data.content,
        startDate: data.startDate.split('T')[0],
        endDate: data.endDate ? data.endDate.split('T')[0] : '',
      });
    } catch (error) {
      console.error('약관 정보 조회 실패:', error);
      alert('약관 정보를 불러오는데 실패했습니다.');
      navigate('/admin/legal');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.version.trim()) {
      newErrors.version = '버전을 입력해주세요.';
    }
    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }
    if (!formData.startDate) {
      newErrors.startDate = '시행일을 선택해주세요.';
    }
    if (formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = '종료일은 시행일 이후여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('입력 내용을 확인해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        ...formData,
        startDate: `${formData.startDate}T00:00:00`,
        endDate: formData.endDate ? `${formData.endDate}T23:59:59` : undefined,
      };

      if (isEditMode) {
        const { type, ...updateData } = requestData;
        await legalAPI.updateTerm(parseInt(id!), updateData);
        alert('약관이 수정되었습니다.');
      } else {
        await legalAPI.createTerm(requestData);
        alert('약관이 등록되었습니다. 자동으로 활성화되었습니다.');
      }

      navigate('/admin/legal');
    } catch (error: any) {
      console.error('약관 저장 실패:', error);
      alert(error.message || '약관 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeDisplayName = (type: string) => {
    return type === 'TERMS_OF_SERVICE' ? '이용약관' : '개인정보 처리방침';
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate('/admin/legal')}
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
        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg p-8 shadow-sm">
          {/* 약관 타입 */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              약관 타입 <span className="text-[#C84630]">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              disabled={isEditMode}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.type ? 'border-red-600' : 'border-[#2C2C2C]/20'
              } focus:border-[#C84630] focus:outline-none bg-white text-[#2C2C2C] ${
                isEditMode ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <option value="TERMS_OF_SERVICE">이용약관</option>
              <option value="PRIVACY_POLICY">개인정보 처리방침</option>
            </select>
            {isEditMode && (
              <p className="text-sm text-[#2C2C2C]/60 mt-2">약관 타입은 수정할 수 없습니다.</p>
            )}
          </div>

          {/* 버전 */}
          <div>
            <label htmlFor="version" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              버전 <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="text"
              id="version"
              name="version"
              value={formData.version}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.version ? 'border-red-600' : 'border-[#2C2C2C]/20'
              } focus:border-[#C84630] focus:outline-none bg-white text-[#2C2C2C]`}
              placeholder="예: 1.0, 2.1, 2024.01.01"
            />
            {errors.version && (
              <p className="text-red-600 text-sm mt-2">{errors.version}</p>
            )}
          </div>

          {/* 시행일 & 종료일 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                시행일 <span className="text-[#C84630]">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.startDate ? 'border-red-600' : 'border-[#2C2C2C]/20'
                } focus:border-[#C84630] focus:outline-none bg-white text-[#2C2C2C]`}
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-2">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                종료일 (선택사항)
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.endDate ? 'border-red-600' : 'border-[#2C2C2C]/20'
                } focus:border-[#C84630] focus:outline-none bg-white text-[#2C2C2C]`}
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-2">{errors.endDate}</p>
              )}
              <p className="text-sm text-[#2C2C2C]/60 mt-2">비워두면 무기한입니다.</p>
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              약관 내용 <span className="text-[#C84630]">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={20}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.content ? 'border-red-600' : 'border-[#2C2C2C]/20'
              } focus:border-[#C84630] focus:outline-none bg-white text-[#2C2C2C] resize-none font-mono text-sm`}
              placeholder="약관 내용을 입력하세요..."
            />
            {errors.content && (
              <p className="text-red-600 text-sm mt-2">{errors.content}</p>
            )}
            <p className="text-sm text-[#2C2C2C]/60 mt-2">
              {isEditMode ? '' : '새로운 약관을 추가하면 이전 약관은 자동으로 비활성화됩니다.'}
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/legal')}
              className="flex-1 px-6 py-3 bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 transition-colors rounded-lg text-[#2C2C2C] font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#C84630] hover:bg-[#A33520] transition-colors rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '저장 중...' : isEditMode ? '수정하기' : '등록하기'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
