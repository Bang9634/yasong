import { useState } from 'react';
import { contestAPI } from '@/utils/api';
import type { UploadedAttachment } from '@/components/attachments/AttachmentUploader';

export function useContestAttachments(id: string | undefined) {
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

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
          await contestAPI.uploadAttachment(savedId, file);
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
    handleUploadFile,
    handleDeleteAttachment,
    uploadPendingFiles,
  };
}
