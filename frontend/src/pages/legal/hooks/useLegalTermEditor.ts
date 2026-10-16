import { useState } from 'react';
import { legalAPI } from '@/utils/api';

interface LegalTermFormData {
  type: 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY';
  version: string;
  content: string;
  startDate: string;
  endDate: string;
}

export function useLegalTermEditor(
  id: string | undefined,
  initialType: string | null,
  onDone: () => void
) {
  const isEditMode = !!id;
  const [formData, setFormData] = useState<LegalTermFormData>({
    type: (initialType as 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY') || 'TERMS_OF_SERVICE',
    version: '',
    content: '',
    startDate: '',
    endDate: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

      onDone();
    } catch (error: any) {
      console.error('약관 저장 실패:', error);
      alert(error.message || '약관 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, isLoading, errors, fetchTerm, handleInputChange, handleSubmit };
}
