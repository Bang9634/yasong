import { useState, useEffect } from 'react';
import { MapPin, Info } from 'lucide-react';
import { websiteAPI } from '@/utils/api';

interface LocationData {
  address: string;
  postalCode: string;
  carInfo: string;
  busInfo: string;
  trainInfo: string;
  parkingInfo: string;
  latitude: string;
  longitude: string;
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
    if (!locationData.address || !locationData.postalCode) {
      alert('주소와 우편번호는 필수 항목입니다.');
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all([
        websiteAPI.updateTextSetting('location_address', locationData.address),
        websiteAPI.updateTextSetting('location_postal_code', locationData.postalCode),
        websiteAPI.updateTextSetting('location_car_info', locationData.carInfo),
        websiteAPI.updateTextSetting('location_bus_info', locationData.busInfo),
        websiteAPI.updateTextSetting('location_train_info', locationData.trainInfo),
        websiteAPI.updateTextSetting('location_parking_info', locationData.parkingInfo),
        websiteAPI.updateTextSetting('location_latitude', locationData.latitude || '36.4347'),
        websiteAPI.updateTextSetting('location_longitude', locationData.longitude || '129.0542'),
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
        {/* 주소 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={locationData.address}
            onChange={(e) => setLocationData({ ...locationData, address: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="경상북도 청송군 청송읍 월막길 123"
          />
        </div>

        {/* 우편번호 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            우편번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={locationData.postalCode}
            onChange={(e) => setLocationData({ ...locationData, postalCode: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="37420"
          />
        </div>

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

        {/* 지도 좌표 */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-teal-600" />
            네이버 지도 마커 위치
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <Info className="w-5 h-5 text-blue-600 inline mr-2" />
            <span className="text-sm text-blue-800">
              네이버 지도에서 미술관 위치에 표시될 마커의 좌표를 입력하세요.
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                위도 (Latitude)
              </label>
              <input
                type="text"
                value={locationData.latitude}
                onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="36.4347"
              />
              <p className="text-xs text-gray-500 mt-1">
                기본값: 36.5058617 (청송야송미술관)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                경도 (Longitude)
              </label>
              <input
                type="text"
                value={locationData.longitude}
                onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="129.0542"
              />
              <p className="text-xs text-gray-500 mt-1">
                기본값: 129.0542 (청송야송미술관)
              </p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-600">
              💡 <strong>좌표 찾는 방법:</strong><br />
              1. <a href="https://map.naver.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">네이버 지도</a>에서 미술관 위치 검색<br />
              2. 해당 위치에서 우클릭 → "여기가 어딘가요?" 클릭<br />
              3. 하단에 표시되는 좌표 복사 (예: 36.4347, 129.0542)
            </p>
          </div>
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
