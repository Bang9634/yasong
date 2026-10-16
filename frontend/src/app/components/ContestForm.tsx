import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { AttachmentUploader, UploadedAttachment } from './common/AttachmentUploader';
import { contestAPI } from '@/utils/api';
import { ChevronLeft, Upload, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { setPageSEO } from '@/utils/seo';
import { resizeImage } from '@/utils/imageUtils';

interface ContestFormData {
  title: string;
  location: string;
  host: string;
  description: string;
  announcementUrl: string;
  startDate: string;
  endDate: string;
}

export function ContestForm() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const canManage = user && isManagerOrAbove(user.role);

  const [formData, setFormData] = useState<ContestFormData>({
    title: '',
    location: '',
    host: '',
    description: '',
    announcementUrl: '',
    startDate: '',
    endDate: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // 첨부파일 관련 상태
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

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

  const fetchContest = async () => {
    try {
      const data = await contestAPI.getContestById(parseInt(id!));
      setFormData({
        title: data.title,
        location: data.location,
        host: data.host,
        description: data.description,
        announcementUrl: data.announcementUrl,
        startDate: data.startDate.split('T')[0],
        endDate: data.endDate.split('T')[0],
      });
      
      if (data.imageUrl) {
        const imageUrl = data.imageUrl.startsWith('http') 
          ? data.imageUrl 
          : `${import.meta.env.VITE_API_BASE_URL || ''}${data.imageUrl}`;
        setImagePreview(imageUrl);
      }

      // 첨부파일 로드
      if (data.attachments) {
        setAttachments(data.attachments);
      }
    } catch (error) {
      console.error('공모전 정보 조회 실패:', error);
      alert('공모전 정보를 불러오는데 실패했습니다.');
      navigate('/contests');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  // 첨부파일 핸들러
  const handleAddPendingFile = (file: File) => {
    setPendingFiles([...pendingFiles, file]);
  };

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles(pendingFiles.filter((_, i) => i !== index));
  };

  const handleUploadFile = async (file: File) => {
    if (!id) {
      alert('공모전을 먼저 저장한 후 첨부파일을 업로드할 수 있습니다.');
      return;
    }

    try {
      setUploadingFile(true);
      const result = await contestAPI.uploadAttachment(id, file);
      setAttachments([...attachments, result]);
      alert('첨부파일이 업로드되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '파일 업로드에 실패했습니다.';
      alert(`업로드 실패\n\n${errorMessage}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    if (!id) return;

    if (!confirm('이 첨부파일을 삭제하시겠습니까?')) return;

    try {
      await contestAPI.deleteAttachment(id, attachmentId);
      setAttachments(attachments.filter(a => a.id !== attachmentId));
      alert('첨부파일이 삭제되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      alert(`삭제 실패\n\n${errorMessage}`);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = '공모전 제목을 입력해주세요.';
    }
    if (!formData.host.trim()) {
      newErrors.host = '주최자를 입력해주세요.';
    }
    if (!formData.location.trim()) {
      newErrors.location = '공모 대상을 입력해주세요.';
    }
    if (!formData.description.trim()) {
      newErrors.description = '공모전 설명을 입력해주세요.';
    }
    if (!formData.announcementUrl.trim()) {
      newErrors.announcementUrl = '공고 URL을 입력해주세요.';
    }
    if (!formData.startDate) {
      newErrors.startDate = '공모 시작일을 선택해주세요.';
    }
    if (!formData.endDate) {
      newErrors.endDate = '공모 종료일을 선택해주세요.';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = '종료일은 시작일 이후여야 합니다.';
    }
    if (!isEditMode && !imageFile) {
      newErrors.imageFile = '공모전 이미지를 업로드해주세요.';
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
      // URL 정규화: http:// 또는 https://가 없으면 추가
      let normalizedUrl = formData.announcementUrl.trim();
      if (normalizedUrl && !normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        // localhost의 경우 http://, 그 외에는 https:// 추가
        if (normalizedUrl.startsWith('localhost') || normalizedUrl.startsWith('127.0.0.1')) {
          normalizedUrl = 'http://' + normalizedUrl;
        } else {
          normalizedUrl = 'https://' + normalizedUrl;
        }
      }

      const requestData = {
        ...formData,
        announcementUrl: normalizedUrl,
        startDate: `${formData.startDate}T00:00:00`,
        endDate: `${formData.endDate}T23:59:59`,
      };

      let savedContestId = id;

      if (isEditMode) {
        // 수정 모드
        await contestAPI.updateContest(parseInt(id!), requestData, imageFile || undefined);
      } else {
        // 추가 모드
        const result = await contestAPI.createContest(requestData, imageFile!);
        savedContestId = result.id?.toString();
      }

      // 임시 첨부파일이 있으면 업로드
      if (pendingFiles.length > 0 && savedContestId) {
        for (const file of pendingFiles) {
          try {
            await contestAPI.uploadAttachment(savedContestId, file);
          } catch (err) {
            console.error('첨부파일 업로드 실패:', file.name, err);
          }
        }
        setPendingFiles([]); // 업로드 완료 후 초기화
      }

      alert(isEditMode ? '공모전이 수정되었습니다.' : '공모전이 등록되었습니다.');
      navigate('/contests');
    } catch (error: any) {
      console.error('공모전 저장 실패:', error);
      alert(error.response?.data?.message || '공모전 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-8 bg-[#F4F4F0]/5 rounded-lg p-8">
          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-[#F4F4F0] mb-2">
              공모전 이미지 <span className="text-[#C84630]">*</span>
            </label>
            <p className="text-sm text-[#F4F4F0]/60 mb-4">
              포스터 형식 (3:4 비율) 권장, 최대 1200x1600px로 자동 리사이즈됩니다.
            </p>

            {imagePreview ? (
              <div className="relative w-full max-w-md">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#F4F4F0]/10">
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
                  className="flex flex-col items-center justify-center w-full max-w-md aspect-[3/4] border-2 border-dashed border-[#F4F4F0]/30 rounded-lg cursor-pointer hover:border-[#C84630] transition-colors bg-[#F4F4F0]/5"
                >
                  <Upload className="w-12 h-12 text-[#F4F4F0]/40 mb-2" />
                  <span className="text-sm text-[#F4F4F0]/60">
                    클릭하여 이미지 업로드
                  </span>
                </label>
              </div>
            )}
            {errors.imageFile && (
              <p className="text-red-400 text-sm mt-2">{errors.imageFile}</p>
            )}
          </div>

          {/* 공모전 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#F4F4F0] mb-2">
              공모전 제목 <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.title ? 'border-red-600' : 'border-[#F4F4F0]/20'
              } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
              placeholder="공모전 제목을 입력하세요"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-2">{errors.title}</p>
            )}
          </div>

          {/* 주최자 */}
          <div>
            <label htmlFor="host" className="block text-sm font-medium text-[#F4F4F0] mb-2">
              주최자 <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="text"
              id="host"
              name="host"
              value={formData.host}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.host ? 'border-red-600' : 'border-[#F4F4F0]/20'
              } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
              placeholder="예: 야송미술관"
            />
            {errors.host && (
              <p className="text-red-400 text-sm mt-2">{errors.host}</p>
            )}
          </div>

          {/* 공모 기간 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-[#F4F4F0] mb-2">
                공모 시작일 <span className="text-[#C84630]">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.startDate ? 'border-red-600' : 'border-[#F4F4F0]/20'
                } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
              />
              {errors.startDate && (
                <p className="text-red-400 text-sm mt-2">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-[#F4F4F0] mb-2">
                공모 종료일 <span className="text-[#C84630]">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.endDate ? 'border-red-600' : 'border-[#F4F4F0]/20'
                } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
              />
              {errors.endDate && (
                <p className="text-red-400 text-sm mt-2">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* 공모 대상 */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[#F4F4F0] mb-2">
              공모 대상 <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.location ? 'border-red-600' : 'border-[#F4F4F0]/20'
              } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
              placeholder="예: 대학(원)생, 일반인 등"
            />
            {errors.location && (
              <p className="text-red-400 text-sm mt-2">{errors.location}</p>
            )}
          </div>

          {/* 공고 URL */}
          <div>
            <label htmlFor="announcementUrl" className="block text-sm font-medium text-[#F4F4F0] mb-2">
              공고 URL <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="text"
              id="announcementUrl"
              name="announcementUrl"
              value={formData.announcementUrl}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.announcementUrl ? 'border-red-600' : 'border-[#F4F4F0]/20'
              } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
              placeholder="https://example.com/contest"
            />
            {errors.announcementUrl && (
              <p className="text-red-400 text-sm mt-2">{errors.announcementUrl}</p>
            )}
          </div>

          {/* 공모전 설명 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#F4F4F0] mb-2">
              공모전 설명 <span className="text-[#C84630]">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={8}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.description ? 'border-red-600' : 'border-[#F4F4F0]/20'
              } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0] resize-none`}
              placeholder="공모전에 대한 설명을 입력하세요"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-2">{errors.description}</p>
            )}
          </div>

          {/* 첨부파일 */}
          <AttachmentUploader
            uploaded={attachments}
            pending={pendingFiles}
            isUploading={uploadingFile}
            isEditMode={isEditMode}
            savedId={id}
            onAddPending={handleAddPendingFile}
            onRemovePending={handleRemovePendingFile}
            onUploadFile={handleUploadFile}
            onDeleteUploaded={handleDeleteAttachment}
            theme="dark"
          />

          {/* 버튼 */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/contests')}
              className="flex-1 px-6 py-3 bg-[#F4F4F0]/10 hover:bg-[#F4F4F0]/20 transition-colors rounded-lg text-[#F4F4F0] font-medium"
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
