import { useState, useEffect } from 'react';
import { MapPin, Info } from 'lucide-react';
import { websiteAPI } from '@/utils/api';

interface LocationData {
  carInfo: string;
  busInfo: string;
  trainInfo: string;
  parkingInfo: string;
}

interface Props {
  initialData: LocationData;
}

export function LocationManagement({ initialData }: Props) {
  const [locationData, setLocationData] = useState<LocationData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setLocationData(initialData);
    }
  }, [initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        websiteAPI.updateTextSetting('location_car_info', locationData.carInfo),
        websiteAPI.updateTextSetting('location_bus_info', locationData.busInfo),
        websiteAPI.updateTextSetting('location_train_info', locationData.trainInfo),
        websiteAPI.updateTextSetting('location_parking_info', locationData.parkingInfo),
      ]);
      alert('오시는 길 정보가 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save location info:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-teal-900 flex items-center">
          <MapPin className="w-7 h-7 mr-3 text-teal-700" />
          오시는 길 관리
        </h2>
        <p className="text-gray-600 mt-2">홈페이지의 오시는 길 정보를 관리합니다.</p>
      </div>

      <div className="space-y-6">
        {/* 자가용 안내 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            자가용 안내
          </label>
          <textarea
            value={locationData.carInfo}
            onChange={(e) => setLocationData({ ...locationData, carInfo: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows={10}
            placeholder="예:&#10;서울 방면: 중앙고속도로 → 영천IC → 국도 28호선 → 청송 방면 (약 3시간 30분 소요)&#10;대구 방면: 중앙고속도로 → 영천IC → 국도 28호선 → 청송 방면 (약 1시간 20분 소요)&#10;부산 방면: 경부고속도로 → 영천IC → 국도 28호선 → 청송 방면 (약 2시간 30분 소요)"
          />
          <p className="text-sm text-gray-500 mt-2">
            각 줄에 지역과 경로를 입력하세요.
          </p>
        </div>

        {/* 버스 안내 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            버스 안내
          </label>
          <textarea
            value={locationData.busInfo}
            onChange={(e) => setLocationData({ ...locationData, busInfo: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows={10}
            placeholder="예:&#10;[시외버스]&#10;동서울터미널 → 청송터미널: 1일 4회 운행 (약 4시간 소요)&#10;대구 동부터미널 → 청송터미널: 1일 10회 운행 (약 1시간 40분 소요)&#10;&#10;[시내버스]&#10;청송터미널 → 야송미술관 정류장: 11번, 22번 버스 이용 (약 15분 소요, 배차 간격 30분)"
          />
          <p className="text-sm text-gray-500 mt-2">
            [제목]과 내용을 구분하여 입력하세요.
          </p>
        </div>

        {/* 기차 안내 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            기차 안내
          </label>
          <textarea
            value={locationData.trainInfo}
            onChange={(e) => setLocationData({ ...locationData, trainInfo: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows={10}
            placeholder="예:&#10;[KTX]&#10;서울역 → 안동역: 1일 15회 운행 (약 2시간 30분)&#10;부산역 → 안동역: 1일 8회 운행 (약 2시간 40분)&#10;&#10;[안동역 → 미술관]&#10;안동역에서 시외버스 이용: 안동 → 청송 시외버스 1일 8회 운행 (약 50분 소요)"
          />
          <p className="text-sm text-gray-500 mt-2">
            [제목]과 내용을 구분하여 입력하세요.
          </p>
        </div>

        {/* 주차 안내 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            주차 안내
          </label>
          <textarea
            value={locationData.parkingInfo}
            onChange={(e) => setLocationData({ ...locationData, parkingInfo: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows={8}
            placeholder="예:&#10;주차 요금: 무료&#10;주차 가능 대수: 승용차 200대&#10;장애인 주차구역: 10대&#10;대형버스 주차: 10대 (사전 예약 필수)&#10;전기차 충전소: 4대 (무료)&#10;주차장 이용시간: 09:00 - 20:00"
          />
          <p className="text-sm text-gray-500 mt-2">
            각 줄에 항목과 내용을 입력하세요. (예: 주차 요금: 무료)
          </p>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 disabled:bg-gray-400 transition-colors font-semibold"
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
