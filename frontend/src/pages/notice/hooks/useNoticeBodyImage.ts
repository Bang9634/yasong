import { useState, useRef, type Dispatch, type SetStateAction } from 'react';
import { noticeAPI, getFullImageUrl } from '@/utils/api';
import { resizeImage } from '@/utils/imageUtils';
import type { NoticeFormData } from '../types';

export function useNoticeBodyImage(
  formData: NoticeFormData,
  setFormData: Dispatch<SetStateAction<NoticeFormData>>
) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // 이미지 업로드 및 본문에 삽입
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    try {
      setUploadingImage(true);
      // 이미지를 WebP로 변환 (최대 1200x1200, 품질 85%)
      const resizedFile = await resizeImage(file, 1200, 1200, 0.85);
      // 공지사항 본문용 이미지 업로드
      const result = await noticeAPI.uploadContentImage(resizedFile);
      const imageUrl = getFullImageUrl(result.imageUrl);

      // 현재 커서 위치에 이미지 마크다운 삽입
      const textarea = contentRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = formData.content;
        const imageMarkdown = `\n![${file.name}](${imageUrl})\n`;
        const newContent =
          currentContent.substring(0, start) + imageMarkdown + currentContent.substring(end);
        setFormData({ ...formData, content: newContent });

        // 커서 위치 조정
        setTimeout(() => {
          textarea.focus();
          const newPosition = start + imageMarkdown.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      } else {
        // textarea ref가 없으면 끝에 추가
        setFormData({
          ...formData,
          content: formData.content + `\n![${file.name}](${imageUrl})\n`,
        });
      }

      alert('이미지가 본문에 삽입되었습니다.');
      e.target.value = ''; // 파일 입력 초기화
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.';
      alert(`업로드 실패\n\n${errorMessage}`);
    } finally {
      setUploadingImage(false);
    }
  };

  return { uploadingImage, contentRef, handleImageUpload };
}
