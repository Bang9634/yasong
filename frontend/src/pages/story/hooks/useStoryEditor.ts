import { useState, useEffect } from 'react';
import { websiteAPI } from '@/utils/api';
import type { Story } from '../types';
import { createDefaultStories } from '../defaults';

export function useStoryEditor() {
  const defaultStories = createDefaultStories();
  const [stories, setStories] = useState<Story[]>(defaultStories);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStories, setEditingStories] = useState<Story[]>(stories);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const result = await websiteAPI
          .getTextSetting('story_list')
          .catch(() => ({ value: JSON.stringify(defaultStories) }));

        const fetchedStories: Story[] = JSON.parse(result.value);
        setStories(fetchedStories);
        setEditingStories(fetchedStories);
      } catch (error) {
        console.error('Failed to fetch stories:', error);
        setStories(defaultStories);
        setEditingStories(defaultStories);
      }
    };

    fetchStories();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await websiteAPI.updateTextSetting('story_list', JSON.stringify(editingStories));

      setStories(editingStories);
      setIsEditModalOpen(false);
      alert('스토리가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save stories:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    stories,
    setStories,
    isEditModalOpen,
    setIsEditModalOpen,
    editingStories,
    setEditingStories,
    isSaving,
    handleSave,
  };
}
