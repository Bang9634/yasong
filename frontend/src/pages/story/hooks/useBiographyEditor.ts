import { useState, useEffect } from 'react';
import { websiteAPI } from '@/utils/api';
import type { BiographySection } from '../types';
import { createDefaultSections } from '../defaults';

export function useBiographyEditor() {
  const defaultSections = createDefaultSections();
  const [sections, setSections] = useState<BiographySection[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSections, setEditingSections] = useState<BiographySection[]>(sections);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<{ [key: number]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const result = await websiteAPI
          .getTextSetting('biography-sections')
          .catch(() => ({ value: JSON.stringify(defaultSections) }));

        console.log('Fetched biography-sections from backend:', result);

        const fetchedSections: BiographySection[] = JSON.parse(result.value);
        console.log('Parsed sections:', fetchedSections);

        setSections(fetchedSections);
        setEditingSections(fetchedSections);
      } catch (error) {
        console.error('Failed to fetch biography sections:', error);
        setSections(defaultSections);
        setEditingSections(defaultSections);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. 먼저 변경된 이미지들을 업로드
      const updatedSections = [...editingSections];

      for (let i = 0; i < updatedSections.length; i++) {
        const section = updatedSections[i];
        const imageFile = imageFiles[section.id];

        if (imageFile) {
          try {
            // 모든 biography 이미지는 동일한 imageType 사용
            // 백엔드의 filePrefix 'biography-'와 timestamp로 자동 구분됨
            const imageType = 'biography';
            console.log(
              `Uploading image for section ${i + 1}, imageType: ${imageType}, file:`,
              imageFile.name
            );

            const response = await websiteAPI.uploadImage(imageType, imageFile);
            console.log(`Upload response for section ${i + 1}:`, response);

            // 업로드된 이미지 URL로 업데이트
            if (response.imageUrl) {
              updatedSections[i].imageUrl = response.imageUrl;
            }
          } catch (error: any) {
            console.error(`Failed to upload image for section ${section.id}:`, error);
            console.error('Error details:', error.message, error.stack);
            alert(
              `섹션 ${i + 1}의 이미지 업로드에 실패했습니다.\n\n에러: ${error.message || '알 수 없는 오류'}`
            );
            setIsSaving(false);
            return;
          }
        }
      }

      // 2. 업데이트된 섹션 데이터를 저장
      await websiteAPI.updateTextSetting('biography-sections', JSON.stringify(updatedSections));

      console.log('Saved sections:', updatedSections);

      setSections(updatedSections);
      setEditingSections(updatedSections);
      setIsEditModalOpen(false);
      setImageFiles({});
      setImagePreviews({});
      alert('약력이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save biography:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    sections,
    setSections,
    isEditModalOpen,
    setIsEditModalOpen,
    editingSections,
    setEditingSections,
    isSaving,
    isLoading,
    imageFiles,
    setImageFiles,
    imagePreviews,
    setImagePreviews,
    handleSave,
  };
}
