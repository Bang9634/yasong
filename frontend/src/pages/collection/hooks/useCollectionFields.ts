import { useState } from 'react';

// 편집 화면과 목록 모달의 입력 상태만 공유한다. 이미지 전처리와 저장 흐름은 각 편집 Hook이 담당한다.
export function useCollectionFields() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  return {
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
