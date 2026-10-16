import { useNoticeBodyImage } from './useNoticeBodyImage';
import type { NoticeFormData } from '../types';
import { useNoticeAttachments } from './useNoticeAttachments';
import { useState, useEffect } from 'react';
import { noticeAPI } from '@/utils/api';

export function useNoticeEditor(noticeId: string | null, canManage: boolean, onDone: () => void) {
  const isEdit = !!noticeId;
  const [formData, setFormData] = useState<NoticeFormData>({
    title: '',
    content: '',
    category: 'GENERAL',
    isPinned: false,
    status: 'PUBLISHED',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { uploadingImage, contentRef, handleImageUpload } = useNoticeBodyImage(
    formData,
    setFormData
  );

  const {
    attachments,
    setAttachments,
    pendingFiles,
    uploadingFile,
    handleAddPendingFile,
    handleRemovePendingFile,
    handleFileUpload,
    handleDeleteAttachment,
    uploadPendingFiles,
  } = useNoticeAttachments(noticeId);

  // 수정일 경우 기존 데이터 로드
  useEffect(() => {
    if (!canManage || !isEdit || !noticeId) return;

    const fetchNotice = async () => {
      try {
        setIsLoading(true);
        const data = canManage
          ? await noticeAPI.getNoticeById(noticeId)
          : await noticeAPI.getVisibleNoticeById(noticeId);
        setFormData({
          title: data.title,
          content: data.content,
          category: data.category,
          isPinned: data.isPinned || false,
          status: data.status || 'PUBLISHED',
        });
        if (data.attachments) {
          setAttachments(data.attachments);
        }
      } catch (err) {
        console.error('공지사항 조회 실패:', err);
        alert('공지사항을 불러오는데 실패했습니다.');
        onDone();
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [canManage, isEdit, noticeId, onDone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      let savedNoticeId = noticeId;

      if (isEdit && noticeId) {
        await noticeAPI.updateNotice(noticeId, formData);
      } else {
        const result = await noticeAPI.createNotice(formData);
        savedNoticeId = result.id?.toString();
      }

      await uploadPendingFiles(savedNoticeId);

      alert(isEdit ? '공지사항이 수정되었습니다.' : '공지사항이 작성되었습니다.');
      onDone();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '작업에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    isLoading,
    attachments,
    uploadingFile,
    uploadingImage,
    pendingFiles,
    contentRef,
    handleImageUpload,
    handleAddPendingFile,
    handleRemovePendingFile,
    handleFileUpload,
    handleDeleteAttachment,
    handleSubmit,
  };
}
