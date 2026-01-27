import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { websiteAPI } from '@/utils/api';
import { resizeImage } from '@/utils/imageUtils';

interface DirectorData {
  name: string;
  bio: string;
  philosophy: string;
  quote: string;
  collection: string;
}

interface DirectorManagementProps {
  initialData?: DirectorData;
  initialImageUrl?: string;
}

export function DirectorManagement({ initialData, initialImageUrl = '' }: DirectorManagementProps) {
  const [directorData, setDirectorData] = useState<DirectorData>(
    initialData || {
      name: '',
      bio: '',
      philosophy: '',
      quote: '',
      collection: '',
    }
  );
  const [directorImage, setDirectorImage] = useState<File | null>(null);
  const [directorImagePreview, setDirectorImagePreview] = useState<string>(initialImageUrl);
  const [isDirectorImageLoading, setIsDirectorImageLoading] = useState(false);
  const [isDirectorLoading, setIsDirectorLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDirectorData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialImageUrl) {
      setDirectorImagePreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleDirectorImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 800, 800);
      setDirectorImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setDirectorImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  const handleDirectorImageUpload = async () => {
    if (!directorImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setIsDirectorImageLoading(true);
      const response = await websiteAPI.uploadImage('director', directorImage);
      alert(response.message || '초대관장 프로필 이미지가 업로드되었습니다.');
      setDirectorImage(null);
      
      const imageUrl = response.imageUrl.startsWith('http') 
        ? response.imageUrl 
        : `${import.meta.env.VITE_API_BASE_URL || ''}${response.imageUrl}`;
      setDirectorImagePreview(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업로드에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsDirectorImageLoading(false);
    }
  };

  const handleDirectorDataUpdate = async () => {
    try {
      setIsDirectorLoading(true);
      await Promise.all([
        websiteAPI.updateTextSetting('director_name', directorData.name),
        websiteAPI.updateTextSetting('director_bio', directorData.bio),
        websiteAPI.updateTextSetting('director_philosophy', directorData.philosophy),
        websiteAPI.updateTextSetting('director_quote', directorData.quote),
        websiteAPI.updateTextSetting('director_collection', directorData.collection),
      ]);
      alert('초대관장 정보가 업데이트되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업데이트에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsDirectorLoading(false);
    }
  };

  return (
    <>
      {/* 초대관장 프로필 이미지 관리 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">초대관장 프로필 이미지</h2>
        <p className="text-sm text-gray-600 mb-4">초대관장 소개 섹션에 표시될 프로필 이미지를 변경할 수 있습니다.</p>
        <div className="space-y-4">
          {directorImagePreview && (
            <div>
              <Label>현재 이미지 미리보기</Label>
              <div className="mt-2 border border-gray-300 rounded-md overflow-hidden flex justify-center">
                <img 
                  src={directorImagePreview} 
                  alt="초대관장 프로필 이미지 미리보기" 
                  className="w-64 h-80 object-cover"
                />
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="directorImage">새 이미지 선택</Label>
            <Input
              id="directorImage"
              type="file"
              accept="image/*"
              onChange={handleDirectorImageChange}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">권장 크기: 800x800px 이상 (세로 사진 권장)</p>
          </div>
          <Button
            onClick={handleDirectorImageUpload}
            disabled={isDirectorImageLoading || !directorImage}
            className="bg-teal-700 hover:bg-teal-800 text-white"
          >
            {isDirectorImageLoading ? '업로드 중...' : '프로필 이미지 업로드'}
          </Button>
        </div>
      </div>

      {/* 초대관장 정보 관리 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">초대관장 정보</h2>
        <p className="text-sm text-gray-600 mb-4">홈페이지의 초대관장 소개 내용을 수정할 수 있습니다.</p>
        <div className="space-y-4">
          <div>
            <Label htmlFor="directorName">관장 이름</Label>
            <Input
              id="directorName"
              type="text"
              value={directorData.name}
              onChange={(e) => setDirectorData({ ...directorData, name: e.target.value })}
              placeholder="야송 이원좌 李元佐 (1939-2019)"
            />
          </div>
          <div>
            <Label htmlFor="directorBio">화백 약력</Label>
            <Textarea
              id="directorBio"
              value={directorData.bio}
              onChange={(e) => setDirectorData({ ...directorData, bio: e.target.value })}
              placeholder="• 로 시작하는 각 줄바꿈 구분"
              rows={8}
            />
            <p className="text-xs text-gray-500 mt-1">각 항목을 줄바꿈으로 구분해주세요</p>
          </div>
          <div>
            <Label htmlFor="directorPhilosophy">예술 세계</Label>
            <Textarea
              id="directorPhilosophy"
              value={directorData.philosophy}
              onChange={(e) => setDirectorData({ ...directorData, philosophy: e.target.value })}
              placeholder="예술 철학 및 작품 세계에 대한 설명"
              rows={10}
            />
            <p className="text-xs text-gray-500 mt-1">단락 구분은 빈 줄로 해주세요</p>
          </div>
          <div>
            <Label htmlFor="directorQuote">인용구</Label>
            <Textarea
              id="directorQuote"
              value={directorData.quote}
              onChange={(e) => setDirectorData({ ...directorData, quote: e.target.value })}
              placeholder='"예술은 자연을 닮아가는 과정이며, 화가는 자연의 목소리를 전하는 사람이다."'
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="directorCollection">주요 소장처</Label>
            <Textarea
              id="directorCollection"
              value={directorData.collection}
              onChange={(e) => setDirectorData({ ...directorData, collection: e.target.value })}
              placeholder="주요 소장처"
              rows={5}
            />
          </div>
          <Button
            onClick={handleDirectorDataUpdate}
            disabled={isDirectorLoading}
            className="bg-teal-700 hover:bg-teal-800 text-white"
          >
            {isDirectorLoading ? '저장 중...' : '초대관장 정보 저장'}
          </Button>
        </div>
      </div>
    </>
  );
}
