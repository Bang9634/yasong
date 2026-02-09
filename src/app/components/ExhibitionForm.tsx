import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { exhibitionAPI } from '@/utils/api';
import { ChevronLeft, Upload, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { setPageSEO } from '@/utils/seo';
import { resizeImage } from '@/utils/imageUtils';

interface ExhibitionFormData {
  title: string;
  location: string;
  description: string;
  type: 'MEMORIAL' | 'RETROSPECTIVE';
  startDate: string;
  endDate: string;
}

export function ExhibitionForm() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const canManage = user && isManagerOrAbove(user.role);

  const [formData, setFormData] = useState<ExhibitionFormData>({
    title: '',
    location: '',
    description: '',
    type: 'MEMORIAL',
    startDate: '',
    endDate: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!canManage) {
      alert('권한이 없습니다.');
      navigate('/exhibitions');
      return;
    }

    if (isEditMode && id) {
      fetchExhibition();
    }

    setPageSEO({
      title: isEditMode ? '전시 수정' : '전시 추가',
      description: '야송 전시 관리',
    });
  }, [id, canManage]);

  const fetchExhibition = async () => {
    try {
      const data = await exhibitionAPI.getExhibitionById(parseInt(id!));
      setFormData({
        title: data.title,
        location: data.location,
        description: data.description,
        type: data.type,
        startDate: data.startDate.split('T')[0],
        endDate: data.endDate.split('T')[0],
      });
      
      if (data.imageUrl) {
        const imageUrl = data.imageUrl.startsWith('http') 
          ? data.imageUrl 
          : `${import.meta.env.VITE_API_BASE_URL || ''}${data.imageUrl}`;
        setImagePreview(imageUrl);
      }
    } catch (error) {
      console.error('전시 정보 조회 실패:', error);
      alert('전시 정보를 불러오는데 실패했습니다.');
      navigate('/exhibitions');
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
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      // 이미지 리사이즈 (포스터 비율 3:4, 최대 너비 1200px)
      const resizedFile = await resizeImage(file, 1200, 1600);
      
      setImageFile(resizedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedFile);

      // 에러 메시지 제거
      if (errors.imageFile) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.imageFile;
          return newErrors;
        });
      }
    } catch (error) {
      console.error('이미지 처리 실패:', error);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = '전시 제목을 입력해주세요.';
    }
    if (!formData.location.trim()) {
      newErrors.location = '전시 장소를 입력해주세요.';
    }
    if (!formData.description.trim()) {
      newErrors.description = '전시 설명을 입력해주세요.';
    }
    if (!formData.startDate) {
      newErrors.startDate = '전시 시작일을 선택해주세요.';
    }
    if (!formData.endDate) {
      newErrors.endDate = '전시 종료일을 선택해주세요.';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = '종료일은 시작일 이후여야 합니다.';
    }
    if (!isEditMode && !imageFile) {
      newErrors.imageFile = '전시 이미지를 업로드해주세요.';
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
        endDate: `${formData.endDate}T23:59:59`,
      };

      if (isEditMode) {
        // 수정 모드
        await exhibitionAPI.updateExhibition(parseInt(id!), requestData, imageFile);
        alert('전시가 수정되었습니다.');
      } else {
        // 추가 모드
        await exhibitionAPI.createExhibition(requestData, imageFile!);
        alert('전시가 등록되었습니다.');
      }

      navigate('/exhibitions');
    } catch (error: any) {
      console.error('전시 저장 실패:', error);
      alert(error.response?.data?.message || '전시 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate('/exhibitions')}
          className="flex items-center gap-2 text-[#2C2C2C]/60 hover:text-[#C84630] transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>전시 목록으로</span>
        </button>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-2 tracking-tight">
            {isEditMode ? '전시 수정' : '전시 추가'}
          </h1>
          <p className="text-lg text-[#2C2C2C]/70">
            {isEditMode ? '전시 정보를 수정합니다' : '새로운 전시를 등록합니다'}
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg p-8">
          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
              전시 이미지 <span className="text-[#C84630]">*</span>
            </label>
            <p className="text-sm text-[#2C2C2C]/60 mb-4">
              포스터 형식 (3:4 비율) 권장, 최대 1200x1600px로 자동 리사이즈됩니다.
            </p>

            {imagePreview ? (
              <div className="relative w-full max-w-md">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#2C2C2C]/10">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full max-w-md aspect-[3/4] border-2 border-dashed border-[#2C2C2C]/30 rounded-lg cursor-pointer hover:border-[#C84630] transition-colors bg-[#2C2C2C]/5"
                >
                  <Upload className="w-12 h-12 text-[#2C2C2C]/40 mb-2" />
                  <span className="text-sm text-[#2C2C2C]/60">
                    클릭하여 이미지 업로드
                  </span>
                </label>
              </div>
            )}
            {errors.imageFile && (
              <p className="text-red-600 text-sm mt-2">{errors.imageFile}</p>
            )}
          </div>

          {/* 전시 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              전시 제목 <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.title ? 'border-red-600' : 'border-[#2C2C2C]/20'
              } focus:border-[#C84630] focus:outline-none text-[#2C2C2C]`}
              placeholder="전시 제목을 입력하세요"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-2">{errors.title}</p>
            )}
          </div>

          {/* 전시 유형 */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              전시 유형 <span className="text-[#C84630]">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-[#2C2C2C]/20 focus:border-[#C84630] focus:outline-none text-[#2C2C2C]"
            >
              <option value="MEMORIAL">추모 전시</option>
              <option value="RETROSPECTIVE">회고전</option>
            </select>
          </div>

          {/* 전시 기간 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                전시 시작일 <span className="text-[#C84630]">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.startDate ? 'border-red-600' : 'border-[#2C2C2C]/20'
                } focus:border-[#C84630] focus:outline-none text-[#2C2C2C]`}
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-2">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                전시 종료일 <span className="text-[#C84630]">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.endDate ? 'border-red-600' : 'border-[#2C2C2C]/20'
                } focus:border-[#C84630] focus:outline-none text-[#2C2C2C]`}
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-2">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* 전시 장소 */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              전시 장소 <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.location ? 'border-red-600' : 'border-[#2C2C2C]/20'
              } focus:border-[#C84630] focus:outline-none text-[#2C2C2C]`}
              placeholder="예: 야송미술관 제1전시실"
            />
            {errors.location && (
              <p className="text-red-600 text-sm mt-2">{errors.location}</p>
            )}
          </div>

          {/* 전시 설명 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              전시 설명 <span className="text-[#C84630]">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={8}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.description ? 'border-red-600' : 'border-[#2C2C2C]/20'
              } focus:border-[#C84630] focus:outline-none text-[#2C2C2C] resize-none`}
              placeholder="전시에 대한 설명을 입력하세요"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-2">{errors.description}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/exhibitions')}
              className="flex-1 px-6 py-3 bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 transition-colors rounded-lg text-[#2C2C2C] font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#C84630] hover:bg-[#A33520] transition-colors rounded-lg text-[#F4F4F0] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
