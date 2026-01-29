import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { websiteAPI } from '@/utils/api';
import { resizeImage } from '@/utils/imageUtils';

interface ContestData {
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  isActive: boolean;
  introLink: string;
  noticeLink: string;
}

interface ContestManagementProps {
  initialData?: ContestData;
}

export function ContestManagement({ initialData }: ContestManagementProps) {
  const [contestData, setContestData] = useState<ContestData>(
    initialData || {
      title: '',
      subtitle: '',
      content: '',
      imageUrl: '',
      isActive: true,
      introLink: '',
      noticeLink: '',
    }
  );
  const [contestImage, setContestImage] = useState<File | null>(null);
  const [contestImagePreview, setContestImagePreview] = useState<string>(initialData?.imageUrl || '');
  const [isContestLoading, setIsContestLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setContestData(initialData);
      if (initialData.imageUrl) {
        setContestImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  const handleContestImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 1200, 1600);
      setContestImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setContestImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  const handleSaveContest = async () => {
    if (!contestData.title || !contestData.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsContestLoading(true);
      
      await Promise.all([
        websiteAPI.updateTextSetting('contest_title', contestData.title),
        websiteAPI.updateTextSetting('contest_subtitle', contestData.subtitle),
        websiteAPI.updateTextSetting('contest_content', contestData.content),
        websiteAPI.updateTextSetting('contest_active', contestData.isActive ? 'true' : 'false'),
        websiteAPI.updateTextSetting('contest_intro_link', contestData.introLink),
        websiteAPI.updateTextSetting('contest_notice_link', contestData.noticeLink),
      ]);
      
      if (contestImage) {
        const response = await websiteAPI.uploadImage('contest_poster', contestImage);
        
        setContestData({
          ...contestData,
          imageUrl: response.imageUrl || contestData.imageUrl,
        });
        
        if (response.imageUrl) {
          const imageUrl = response.imageUrl.startsWith('http')
            ? response.imageUrl
            : `${import.meta.env.VITE_API_BASE_URL || ''}${response.imageUrl}`;
          setContestImagePreview(imageUrl);
        }
        
        setContestImage(null);
      }
      
      alert('공모전 정보가 업데이트되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업데이트에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsContestLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">공모전 정보</h2>
      <p className="text-sm text-gray-600 mb-4">홈페이지에 표시되는 공모전 정보를 관리할 수 있습니다.</p>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="contestActive"
            checked={contestData.isActive}
            onChange={(e) => setContestData({ ...contestData, isActive: e.target.checked })}
            className="w-4 h-4"
          />
          <Label htmlFor="contestActive" className="cursor-pointer">
            홈페이지에 공모전 섹션 표시
          </Label>
        </div>

        {contestImagePreview && (
          <div>
            <Label>현재 포스터 이미지</Label>
            <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
              <img 
                src={contestImagePreview} 
                alt="공모전 포스터 미리보기" 
                className="w-full max-w-md h-auto object-cover"
              />
            </div>
          </div>
        )}
        
        <div>
          <Label htmlFor="contestImage">포스터 이미지</Label>
          <Input
            id="contestImage"
            type="file"
            accept="image/*"
            onChange={handleContestImageChange}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">권장 비율: 3:4 세로 포스터 (예: 900x1200px)</p>
        </div>

        <div>
          <Label htmlFor="contestTitle">큰 제목 *</Label>
          <Input
            id="contestTitle"
            type="text"
            value={contestData.title}
            onChange={(e) => setContestData({ ...contestData, title: e.target.value })}
            placeholder="예: 제44회 대한민국미술대전 <구상부문> 개최공고"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="contestSubtitle">작은 제목 (선택)</Label>
          <Input
            id="contestSubtitle"
            type="text"
            value={contestData.subtitle}
            onChange={(e) => setContestData({ ...contestData, subtitle: e.target.value })}
            placeholder="예: 대한민국미술대전 구상부문"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="contestContent">내용 *</Label>
          <Textarea
            id="contestContent"
            value={contestData.content}
            onChange={(e) => setContestData({ ...contestData, content: e.target.value })}
            placeholder="전시명: 제44회 대한민국미술대전...&#10;전시장소: 안성예술의전당 화랑전...&#10;전시기간: 2026년 1월 14일(수) ~..."
            rows={6}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">각 항목을 줄바꿈으로 구분해주세요</p>
        </div>

        <div>
          <Label htmlFor="contestIntroLink">공모전 정보 버튼 링크</Label>
          <Input
            id="contestIntroLink"
            type="url"
            value={contestData.introLink}
            onChange={(e) => setContestData({ ...contestData, introLink: e.target.value })}
            placeholder="https://example.com/intro"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">공모전 정ㅂ 버튼 클릭 시 이동할 URL을 입력하세요</p>
        </div>

        <div>
          <Label htmlFor="contestNoticeLink">커카오톡 문의 버튼 링크</Label>
          <Input
            id="contestNoticeLink"
            type="url"
            value={contestData.noticeLink}
            onChange={(e) => setContestData({ ...contestData, noticeLink: e.target.value })}
            placeholder="https://example.com/notice"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">커카오톡 문의 버튼 클릭 시 이동할 URL을 입력하세요</p>
        </div>

        <Button
          onClick={handleSaveContest}
          disabled={isContestLoading}
          className="bg-teal-700 hover:bg-teal-800 text-white w-full"
        >
          {isContestLoading ? '저장 중...' : '공모전 정보 저장'}
        </Button>
      </div>
    </div>
  );
}
