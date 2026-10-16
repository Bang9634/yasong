import { useContestAttachments } from './useContestAttachments';
import { useState } from 'react';
import { contestAPI } from '@/utils/api';
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

export function useContestEditor(id: string | undefined, onDone: () => void) {
  const isEditMode = !!id;
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

  const {
    attachments,
    setAttachments,
    pendingFiles,
    uploadingFile,
    handleAddPendingFile,
    handleRemovePendingFile,
    handleUploadFile,
    handleDeleteAttachment,
    uploadPendingFiles,
  } = useContestAttachments(id);

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
      onDone();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (
        normalizedUrl &&
        !normalizedUrl.startsWith('http://') &&
        !normalizedUrl.startsWith('https://')
      ) {
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

      await uploadPendingFiles(savedContestId);

      alert(isEditMode ? '공모전이 수정되었습니다.' : '공모전이 등록되었습니다.');
      onDone();
    } catch (error: any) {
      console.error('공모전 저장 실패:', error);
      alert(error.response?.data?.message || '공모전 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}
