import { useState } from 'react';
import { noticeAPI } from '@/utils/api';

interface Attachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
}

export function useNoticeAttachments(noticeId: string | null) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]); // 임시 첨부파일
  const [uploadingFile, setUploadingFile] = useState(false);

  // 임시 첨부파일 추가
  const handleAddPendingFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    // 중복 파일 체크
    if (pendingFiles.some((f) => f.name === file.name && f.size === file.size)) {
      alert('이미 추가된 파일입니다.');
      return;
    }

    setPendingFiles([...pendingFiles, file]);
    e.target.value = ''; // 파일 입력 초기화
  };

  // 임시 첨부파일 제거
  const handleRemovePendingFile = (index: number) => {
    setPendingFiles(pendingFiles.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    if (!noticeId) {
      alert('공지사항을 먼저 저장한 후 첨부파일을 업로드할 수 있습니다.');
      return;
    }

    try {
      setUploadingFile(true);
      const result = await noticeAPI.uploadAttachment(noticeId, file);
      setAttachments([...attachments, result]);
      alert('첨부파일이 업로드되었습니다.');
      e.target.value = ''; // 파일 입력 초기화
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '파일 업로드에 실패했습니다.';
      alert(`업로드 실패\n\n${errorMessage}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    if (!noticeId) return;

    if (!confirm('이 첨부파일을 삭제하시겠습니까?')) return;

    try {
      await noticeAPI.deleteAttachment(noticeId, attachmentId);
      setAttachments(attachments.filter((a) => a.id !== attachmentId));
      alert('첨부파일이 삭제되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      alert(`삭제 실패\n\n${errorMessage}`);
    }
  };

  const uploadPendingFiles = async (savedId: string | undefined | null) => {
    if (pendingFiles.length > 0 && savedId) {
      for (const file of pendingFiles) {
        try {
          await noticeAPI.uploadAttachment(savedId, file);
        } catch (err) {
          console.error('첨부파일 업로드 실패:', file.name, err);
        }
      }
      setPendingFiles([]); // 업로드 완료 후 초기화
    }
  };

  return {
    attachments,
    setAttachments,
    pendingFiles,
    uploadingFile,
    handleAddPendingFile,
    handleRemovePendingFile,
    handleFileUpload,
    handleDeleteAttachment,
    uploadPendingFiles,
  };
}
