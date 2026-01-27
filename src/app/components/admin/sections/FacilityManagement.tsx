import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { websiteAPI } from '@/utils/api';

interface FacilityManagementProps {
  siteArea?: string;
  exhibitionRooms?: string;
  collectionCount?: string;
}

export function FacilityManagement({
  siteArea = '',
  exhibitionRooms = '',
  collectionCount = '',
}: FacilityManagementProps) {
  const [facilitySiteArea, setFacilitySiteArea] = useState<string>(siteArea);
  const [facilityExhibitionRooms, setFacilityExhibitionRooms] = useState<string>(exhibitionRooms);
  const [facilityCollectionCount, setFacilityCollectionCount] = useState<string>(collectionCount);
  const [isFacilityLoading, setIsFacilityLoading] = useState(false);

  useEffect(() => {
    if (siteArea) {
      setFacilitySiteArea(siteArea);
    }
  }, [siteArea]);

  useEffect(() => {
    if (exhibitionRooms) {
      setFacilityExhibitionRooms(exhibitionRooms);
    }
  }, [exhibitionRooms]);

  useEffect(() => {
    if (collectionCount) {
      setFacilityCollectionCount(collectionCount);
    }
  }, [collectionCount]);

  const handleSaveFacility = async () => {
    try {
      setIsFacilityLoading(true);
      await Promise.all([
        websiteAPI.updateTextSetting('facility_site_area', facilitySiteArea),
        websiteAPI.updateTextSetting('facility_exhibition_rooms', facilityExhibitionRooms),
        websiteAPI.updateTextSetting('facility_collection_count', facilityCollectionCount),
      ]);
      alert('시설 규모 정보가 저장되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '저장에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsFacilityLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">시설 규모 정보</h2>
      <p className="text-sm text-gray-600 mb-4">미술관 연혁 하단에 표시되는 시설 규모 정보를 관리할 수 있습니다.</p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="facilitySiteArea">전체 부지 면적 (㎡ 단위는 자동 추가)</Label>
          <Input
            id="facilitySiteArea"
            type="text"
            value={facilitySiteArea}
            onChange={(e) => setFacilitySiteArea(e.target.value)}
            placeholder="예: 3,500"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">숫자만 입력하세요 (단위 ㎡는 자동으로 표시됩니다)</p>
        </div>

        <div>
          <Label htmlFor="facilityExhibitionRooms">전시실 및 특별실 ('개' 단위는 자동 추가)</Label>
          <Input
            id="facilityExhibitionRooms"
            type="text"
            value={facilityExhibitionRooms}
            onChange={(e) => setFacilityExhibitionRooms(e.target.value)}
            placeholder="예: 6"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">숫자만 입력하세요 (단위 '개'는 자동으로 표시됩니다)</p>
        </div>

        <div>
          <Label htmlFor="facilityCollectionCount">소장품 수 ('점' 단위는 자동 추가)</Label>
          <Input
            id="facilityCollectionCount"
            type="text"
            value={facilityCollectionCount}
            onChange={(e) => setFacilityCollectionCount(e.target.value)}
            placeholder="예: 420"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">숫자만 입력하세요 (단위 '점'은 자동으로 표시됩니다)</p>
        </div>

        <Button
          onClick={handleSaveFacility}
          disabled={isFacilityLoading}
          className="bg-teal-700 hover:bg-teal-800 text-white w-full"
        >
          {isFacilityLoading ? '저장 중...' : '시설 규모 저장'}
        </Button>
      </div>
    </div>
  );
}
