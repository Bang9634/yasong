import { useState } from 'react';
import { photoAPI } from '@/utils/api';
import { resizeImage } from '@/utils/imageUtils';

interface PhotoFormData {
  title: string;
  description: string;
}

export function usePhotoEditor(id: string | undefined, onDone: () => void) {
  const isEditMode = !!id;
  const [formData, setFormData] = useState<PhotoFormData>({
    title: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchPhoto = async () => {
    try {
      const data = await photoAPI.getPhotoById(parseInt(id!));
      setFormData({
        title: data.title,
        description: data.description,
      });

      if (data.imageUrl) {
        const imageUrl = data.imageUrl.startsWith('http')
          ? data.imageUrl
          : `${import.meta.env.VITE_API_BASE_URL || ''}${data.imageUrl}`;
        setImagePreview(imageUrl);
      }
    } catch (error) {
      console.error('사진 자료 조회 실패:', error);
      alert('사진 자료를 불러오는데 실패했습니다.');
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
      newErrors.title = '제목을 입력해주세요.';
    }
    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요.';
    }
    if (!isEditMode && !imageFile) {
      newErrors.imageFile = '이미지를 업로드해주세요.';
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
      if (isEditMode) {
        // 수정 모드
        await photoAPI.updatePhoto(parseInt(id!), formData, imageFile || undefined);
        alert('사진 자료가 수정되었습니다.');
      } else {
        // 추가 모드
        await photoAPI.createPhoto(formData, imageFile!);
        alert('사진 자료가 등록되었습니다.');
      }

      onDone();
    } catch (error: any) {
      console.error('사진 자료 저장 실패:', error);
      alert(error.response?.data?.message || '사진 자료 저장에 실패했습니다.');
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
    fetchPhoto,
  };
}
