import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { websiteAPI } from '@/utils/api';
import { resizeImage } from '@/utils/imageUtils';

interface BuildingManagementProps {
  mainBuildingImageUrl?: string;
  mainBuildingText?: string;
  cheongryangImageUrl?: string;
  cheongryangText?: string;
}

export function BuildingManagement({
  mainBuildingImageUrl = '',
  mainBuildingText = '',
  cheongryangImageUrl = '',
  cheongryangText = '',
}: BuildingManagementProps) {
  // 본관 건물
  const [mainBuildingImage, setMainBuildingImage] = useState<File | null>(null);
  const [mainBuildingImagePreview, setMainBuildingImagePreview] = useState<string>(mainBuildingImageUrl);
  const [mainBuildingTextValue, setMainBuildingTextValue] = useState<string>(mainBuildingText);
  const [isMainBuildingLoading, setIsMainBuildingLoading] = useState(false);

  // 청량대운도전시관
  const [cheongryangImage, setCheongryangImage] = useState<File | null>(null);
  const [cheongryangImagePreview, setCheongryangImagePreview] = useState<string>(cheongryangImageUrl);
  const [cheongryangTextValue, setCheongryangTextValue] = useState<string>(cheongryangText);
  const [isCheongryangLoading, setIsCheongryangLoading] = useState(false);

  useEffect(() => {
    if (mainBuildingImageUrl) {
      setMainBuildingImagePreview(mainBuildingImageUrl);
    }
  }, [mainBuildingImageUrl]);

  useEffect(() => {
    if (mainBuildingText) {
      setMainBuildingTextValue(mainBuildingText);
    }
  }, [mainBuildingText]);

  useEffect(() => {
    if (cheongryangImageUrl) {
      setCheongryangImagePreview(cheongryangImageUrl);
    }
  }, [cheongryangImageUrl]);

  useEffect(() => {
    if (cheongryangText) {
      setCheongryangTextValue(cheongryangText);
    }
  }, [cheongryangText]);

  // 본관 핸들러
  const handleMainBuildingImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 1920, 1080);
      setMainBuildingImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMainBuildingImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  const handleMainBuildingImageUpload = async () => {
    if (!mainBuildingImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setIsMainBuildingLoading(true);
      const response = await websiteAPI.uploadImage('main_building', mainBuildingImage);
      alert(response.message || '본관 건물 이미지가 업로드되었습니다.');
      setMainBuildingImage(null);
      
      const imageUrl = response.imageUrl.startsWith('http') 
        ? response.imageUrl 
        : `${import.meta.env.VITE_API_BASE_URL || ''}${response.imageUrl}`;
      setMainBuildingImagePreview(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업로드에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsMainBuildingLoading(false);
    }
  };

  const handleMainBuildingTextUpdate = async () => {
    try {
      setIsMainBuildingLoading(true);
      await websiteAPI.updateTextSetting('main_building_description', mainBuildingTextValue);
      alert('본관 건물 소개가 업데이트되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업데이트에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsMainBuildingLoading(false);
    }
  };

  // 청량대운도전시관 핸들러
  const handleCheongryangImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 1920, 1080);
      setCheongryangImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCheongryangImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  const handleCheongryangImageUpload = async () => {
    if (!cheongryangImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setIsCheongryangLoading(true);
      const response = await websiteAPI.uploadImage('cheongryangdae_building', cheongryangImage);
      alert(response.message || '청량대운도전시관 이미지가 업로드되었습니다.');
      setCheongryangImage(null);
      
      const imageUrl = response.imageUrl.startsWith('http') 
        ? response.imageUrl 
        : `${import.meta.env.VITE_API_BASE_URL || ''}${response.imageUrl}`;
      setCheongryangImagePreview(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업로드에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsCheongryangLoading(false);
    }
  };

  const handleCheongryangTextUpdate = async () => {
    try {
      setIsCheongryangLoading(true);
      await websiteAPI.updateTextSetting('cheongryangdae_building_description', cheongryangTextValue);
      alert('청량대운도전시관 소개가 업데이트되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업데이트에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsCheongryangLoading(false);
    }
  };

  return (
    <>
      {/* 본관 건물 이미지 및 텍스트 관리 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">군립청송야송미술관 (본관)</h2>
        <p className="text-sm text-gray-600 mb-4">본관 건물 이미지와 소개 텍스트를 관리할 수 있습니다.</p>
        <div className="space-y-4">
          {mainBuildingImagePreview && (
            <div>
              <Label>현재 이미지 미리보기</Label>
              <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
                <img 
                  src={mainBuildingImagePreview} 
                  alt="본관 건물 이미지 미리보기" 
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="mainBuildingImage">건물 이미지 선택</Label>
            <Input
              id="mainBuildingImage"
              type="file"
              accept="image/*"
              onChange={handleMainBuildingImageChange}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">권장 크기: 1920x1080px</p>
          </div>
          <Button
            onClick={handleMainBuildingImageUpload}
            disabled={isMainBuildingLoading || !mainBuildingImage}
            className="bg-teal-700 hover:bg-teal-800 text-white"
          >
            {isMainBuildingLoading ? '업로드 중...' : '본관 이미지 업로드'}
          </Button>
          
          <div className="border-t pt-4 mt-4">
            <Label htmlFor="mainBuildingText">건물 소개</Label>
            <Textarea
              id="mainBuildingText"
              value={mainBuildingTextValue}
              onChange={(e) => setMainBuildingTextValue(e.target.value)}
              placeholder="군립청송야송미술관 소개 텍스트를 입력하세요"
              rows={4}
            />
            <Button
              onClick={handleMainBuildingTextUpdate}
              disabled={isMainBuildingLoading}
              className="bg-teal-700 hover:bg-teal-800 text-white mt-2"
            >
              {isMainBuildingLoading ? '저장 중...' : '본관 소개 저장'}
            </Button>
          </div>
        </div>
      </div>

      {/* 청량대운도전시관 이미지 및 텍스트 관리 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">청량대운도전시관</h2>
        <p className="text-sm text-gray-600 mb-4">청량대운도전시관 건물 이미지와 소개 텍스트를 관리할 수 있습니다.</p>
        <div className="space-y-4">
          {cheongryangImagePreview && (
            <div>
              <Label>현재 이미지 미리보기</Label>
              <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
                <img 
                  src={cheongryangImagePreview} 
                  alt="청량대운도전시관 이미지 미리보기" 
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="cheongryangImage">건물 이미지 선택</Label>
            <Input
              id="cheongryangImage"
              type="file"
              accept="image/*"
              onChange={handleCheongryangImageChange}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">권장 크기: 1920x1080px</p>
          </div>
          <Button
            onClick={handleCheongryangImageUpload}
            disabled={isCheongryangLoading || !cheongryangImage}
            className="bg-teal-700 hover:bg-teal-800 text-white"
          >
            {isCheongryangLoading ? '업로드 중...' : '청량대운도전시관 이미지 업로드'}
          </Button>
          
          <div className="border-t pt-4 mt-4">
            <Label htmlFor="cheongryangText">건물 소개</Label>
            <Textarea
              id="cheongryangText"
              value={cheongryangTextValue}
              onChange={(e) => setCheongryangTextValue(e.target.value)}
              placeholder="청량대운도전시관 소개 텍스트를 입력하세요"
              rows={4}
            />
            <Button
              onClick={handleCheongryangTextUpdate}
              disabled={isCheongryangLoading}
              className="bg-teal-700 hover:bg-teal-800 text-white mt-2"
            >
              {isCheongryangLoading ? '저장 중...' : '청량대운도전시관 소개 저장'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
