import { useState, useEffect } from 'react';
import { updateLogAPI } from '@/utils/api';

export function useUpdateLogEditor(logId: string | null, canManage: boolean, onDone: () => void) {
  const isEdit = !!logId;
  const [formData, setFormData] = useState({
    title: '',
    version: '',
    updateDate: new Date().toISOString().split('T')[0],
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 수정일 경우 기존 데이터 로드
  useEffect(() => {
    if (!canManage || !isEdit || !logId) return;

    const fetchLog = async () => {
      try {
        setIsLoading(true);
        const data = await updateLogAPI.getUpdateLogById(logId);
        setFormData({
          title: data.title,
          version: data.version,
          updateDate: data.updateDate,
          content: data.content,
        });
      } catch (err) {
        console.error('업데이트 내역 조회 실패:', err);
        alert('업데이트 내역을 불러오는데 실패했습니다.');
        onDone();
      } finally {
        setIsLoading(false);
      }
    };

    fetchLog();
  }, [canManage, isEdit, logId, onDone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.version.trim()) {
      alert('버전을 입력해주세요.');
      return;
    }
    if (!formData.updateDate) {
      alert('업데이트 날짜를 선택해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEdit && logId) {
        await updateLogAPI.updateUpdateLog(logId, formData);
        alert('업데이트 내역이 수정되었습니다.');
      } else {
        await updateLogAPI.createUpdateLog(formData);
        alert('업데이트 내역이 등록되었습니다.');
      }

      onDone();
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      onDone();
    }
  };

  return { formData, setFormData, isSubmitting, isLoading, handleSubmit, handleCancel };
}
