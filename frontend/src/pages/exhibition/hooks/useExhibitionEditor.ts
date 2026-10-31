import type { ExhibitionType } from '@/utils/exhibitionTypes';
import { useState } from 'react';
import { exhibitionAPI } from '@/utils/api';
import { resizeImage } from '@/utils/imageUtils';

interface ExhibitionFormData {
  title: string;
  location: string;
  description: string;
  type: ExhibitionType;
  startDate: string;
  endDate: string;
}

export function useExhibitionEditor(id: string | undefined, onDone: () => void) {
  const isEditMode = !!id;
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
      onDone();
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

      onDone();
    } catch (error: any) {
      console.error('전시 저장 실패:', error);
      alert(error.response?.data?.message || '전시 저장에 실패했습니다.');
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
    fetchExhibition,
  };
}
