import { useState } from 'react';
import { collectionAPI, getFullImageUrl } from '@/utils/api';
import { resizeImage } from '@/utils/imageUtils';
import { useCollectionFields } from './useCollectionFields';

export function useCollectionEditor(id: string | undefined, onDone: () => void) {
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const {
    title,
    setTitle,
    year,
    setYear,
    size,
    setSize,
    description,
    setDescription,
    artist,
    setArtist,
    isPinned,
    setIsPinned,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
  } = useCollectionFields();

  const loadCollection = async (collectionId: number) => {
    try {
      setLoading(true);
      const data = await collectionAPI.getCollectionById(collectionId.toString());
      setTitle(data.title);
      setYear(data.year);
      setSize(data.size);
      setDescription(data.description);
      setArtist(data.artist);
      setIsPinned(data.isPinned);
      setImagePreview(getFullImageUrl(data.imageUrl));
    } catch (error) {
      console.error('소장품 로드 실패:', error);
      alert('소장품을 불러오는데 실패했습니다.');
      onDone();
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // 이미지 리사이징 및 WebP 변환 (최대 1200x1200, 품질 80%)
        const resizedFile = await resizeImage(file, 1200, 1200, 0.8);
        setImageFile(resizedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(resizedFile);
      } catch (error) {
        console.error('이미지 처리 실패:', error);
        alert('이미지 처리에 실패했습니다.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !year || !size || !description || !artist) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!isEditing && !imageFile) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setLoading(true);

      if (isEditing && id) {
        await collectionAPI.updateCollection(
          id,
          {
            title,
            year,
            size,
            description,
            artist,
            isPinned,
          },
          imageFile || undefined
        );
        alert('소장품이 수정되었습니다.');
      } else {
        await collectionAPI.createCollection(
          {
            title,
            year,
            size,
            description,
            artist,
            isPinned,
          },
          imageFile!
        );
        alert('소장품이 추가되었습니다.');
      }

      onDone();
    } catch (error) {
      console.error('소장품 저장 실패:', error);
      alert('소장품 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    loadCollection,
    handleImageChange,
    handleSubmit,
    title,
    setTitle,
    year,
    setYear,
    size,
    setSize,
    description,
    setDescription,
    artist,
    setArtist,
    isPinned,
    setIsPinned,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
  };
}
