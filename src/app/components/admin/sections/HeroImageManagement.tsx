import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { websiteAPI } from '@/utils/api';
import { resizeImage } from '@/utils/imageUtils';

interface HeroImageManagementProps {
  initialImageUrl?: string;
}

export function HeroImageManagement({ initialImageUrl = '' }: HeroImageManagementProps) {
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>(initialImageUrl);
  const [isHeroImageLoading, setIsHeroImageLoading] = useState(false);

  useEffect(() => {
    if (initialImageUrl) {
      setHeroImagePreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 1920, 1080);
      setHeroImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  const handleHeroImageUpload = async () => {
    if (!heroImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setIsHeroImageLoading(true);
      const response = await websiteAPI.uploadImage('hero', heroImage);
      alert(response.message || 'Hero 이미지가 업로드되었습니다.');
      setHeroImage(null);
      
      const imageUrl = response.imageUrl.startsWith('http') 
        ? response.imageUrl 
        : `${import.meta.env.VITE_API_BASE_URL || ''}${response.imageUrl}`;
      setHeroImagePreview(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업로드에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsHeroImageLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Hero 배경 이미지</h2>
      <p className="text-sm text-gray-600 mb-4">홈페이지 최상단 Hero 섹션의 배경 이미지를 변경할 수 있습니다.</p>
      <div className="space-y-4">
        {heroImagePreview && (
          <div>
            <Label>현재 이미지 미리보기</Label>
            <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
              <img 
                src={heroImagePreview} 
                alt="Hero 이미지 미리보기" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        )}
        <div>
          <Label htmlFor="heroImage">새 이미지 선택</Label>
          <Input
            id="heroImage"
            type="file"
            accept="image/*"
            onChange={handleHeroImageChange}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">권장 크기: 1920x1080px 이상</p>
        </div>
        <Button
          onClick={handleHeroImageUpload}
          disabled={isHeroImageLoading || !heroImage}
          className="bg-teal-700 hover:bg-teal-800 text-white"
        >
          {isHeroImageLoading ? '업로드 중...' : 'Hero 이미지 업로드'}
        </Button>
      </div>
    </div>
  );
}
