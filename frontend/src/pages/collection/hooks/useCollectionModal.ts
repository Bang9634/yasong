import { useState } from 'react';
import { collectionAPI, getFullImageUrl } from '@/utils/api';
import { useCollectionFields } from './useCollectionFields';
import type { Collection } from '../types';

export function useCollectionModal(loadCollections: () => Promise<void>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);

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

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (collection: Collection) => {
    setCurrentCollection(collection);
    setTitle(collection.title);
    setYear(collection.year);
    setSize(collection.size);
    setDescription(collection.description);
    setArtist(collection.artist);
    setIsPinned(collection.isPinned);
    setImagePreview(getFullImageUrl(collection.imageUrl));
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setYear('');
    setSize('');
    setDescription('');
    setArtist('');
    setIsPinned(false);
    setImageFile(null);
    setImagePreview('');
    setCurrentCollection(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      const data = {
        title,
        year,
        size,
        description,
        artist,
        isPinned,
      };

      if (isEditing && currentCollection) {
        await collectionAPI.updateCollection(
          String(currentCollection.id),
          data,
          imageFile || undefined
        );
        alert('작품이 수정되었습니다.');
      } else {
        await collectionAPI.createCollection(data, imageFile!);
        alert('작품이 추가되었습니다.');
      }

      closeModal();
      loadCollections();
    } catch (error: any) {
      console.error('Failed to save collection:', error);
      alert(error.message || '작품 저장에 실패했습니다.');
    }
  };

  return {
    isModalOpen,
    isEditing,
    openEditModal,
    closeModal,
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
