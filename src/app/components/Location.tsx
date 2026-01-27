import { useState, useEffect } from 'react';
import { MapPin, Bus, Train, Car, Navigation } from 'lucide-react';
import { websiteAPI } from '@/utils/api';

interface LocationData {
  address: string;
  postalCode: string;
  carInfo: string;
  busInfo: string;
  trainInfo: string;
  parkingInfo: string;
}

export function Location() {
  const [locationData, setLocationData] = useState<LocationData>({
    address: '',
    postalCode: '',
    carInfo: '',
    busInfo: '',
    trainInfo: '',
    parkingInfo: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocationData();
  }, []);

  const loadLocationData = async () => {
    try {
      const [addressData, postalCodeData, carData, busData, trainData, parkingData] = await Promise.all([
        websiteAPI.getTextSetting('location_address'),
        websiteAPI.getTextSetting('location_postal_code'),
        websiteAPI.getTextSetting('location_car_info'),
        websiteAPI.getTextSetting('location_bus_info'),
        websiteAPI.getTextSetting('location_train_info'),
        websiteAPI.getTextSetting('location_parking_info'),
      ]);

      setLocationData({
        address: addressData.value || '경상북도 청송군 청송읍 월막길 123',
        postalCode: postalCodeData.value || '37420',
        carInfo: carData.value || '',
        busInfo: busData.value || '',
        trainInfo: trainData.value || '',
        parkingInfo: parkingData.value || '',
      });
    } catch (error) {
      console.error('Failed to load location data:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseLines = (text: string) => {
    return text.split('\n').filter(line => line.trim());
  };

  if (loading) {
    return (
      <section id="location" className="py-20 bg-gradient-to-b from-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">로딩 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="location" className="py-20 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">오시는 길</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          <div className="flex items-center justify-center text-lg text-gray-700 mb-2">
            <MapPin className="w-6 h-6 mr-2 text-teal-600" />
            {locationData.address}
          </div>
          <p className="text-gray-600">우편번호: {locationData.postalCode}</p>
        </div>

        {/* 지도 영역 */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-12 border-2 border-teal-200">
          <div className="relative h-96 bg-gradient-to-br from-teal-100 via-teal-50 to-emerald-50 flex items-center justify-center">
            <div className="text-center">
              <Navigation className="w-20 h-20 text-teal-600 mx-auto mb-4" />
              <p className="text-2xl text-teal-800 mb-2">지도 영역</p>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                실제 구현 시 카카오맵 또는 네이버 지도 API 연동
              </p>
              <div className="mt-6 space-x-4">
                <button className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors">
                  카카오맵으로 보기
                </button>
                <button className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors">
                  네이버 지도로 보기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 교통수단별 안내 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* 자가용 */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-teal-700 rounded-full flex items-center justify-center mr-4">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-teal-900">자가용</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              {locationData.carInfo ? (
                parseLines(locationData.carInfo).map((line, index) => (
                  <div key={index} className="border-l-4 border-teal-600 pl-4">
                    <p className="text-sm leading-relaxed">{line}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">자가용 안내 정보가 없습니다.</p>
              )}
            </div>
          </div>

          {/* 대중교통 - 버스 */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-teal-700 rounded-full flex items-center justify-center mr-4">
                <Bus className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-teal-900">버스</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              {locationData.busInfo ? (
                parseLines(locationData.busInfo).map((line, index) => {
                  const isSection = line.startsWith('[') && line.endsWith(']');
                  if (isSection) {
                    return (
                      <div key={index} className="border-l-4 border-amber-600 pl-4">
                        <p className="text-amber-700 font-semibold mb-2">{line.slice(1, -1)}</p>
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="text-sm leading-relaxed pl-4">{line}</p>
                  );
                })
              ) : (
                <p className="text-gray-500">버스 안내 정보가 없습니다.</p>
              )}
            </div>
          </div>

          {/* 기차 */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-teal-700 rounded-full flex items-center justify-center mr-4">
                <Train className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-teal-900">기차</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              {locationData.trainInfo ? (
                parseLines(locationData.trainInfo).map((line, index) => {
                  const isSection = line.startsWith('[') && line.endsWith(']');
                  if (isSection) {
                    return (
                      <div key={index} className="border-l-4 border-emerald-600 pl-4">
                        <p className="text-emerald-700 font-semibold mb-2">{line.slice(1, -1)}</p>
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="text-sm leading-relaxed pl-4">{line}</p>
                  );
                })
              ) : (
                <p className="text-gray-500">기차 안내 정보가 없습니다.</p>
              )}
            </div>
          </div>
        </div>

        {/* 주차 안내 */}
        <div className="bg-teal-700 text-white p-8 rounded-lg shadow-lg mb-12">
          <h3 className="text-2xl mb-6 border-b-2 border-amber-400 pb-3">주차 안내</h3>
          <div className="space-y-3">
            {locationData.parkingInfo ? (
              parseLines(locationData.parkingInfo).map((line, index, array) => (
                <div
                  key={index}
                  className={`flex justify-between ${index < array.length - 1 ? 'border-b border-teal-600 pb-2' : ''}`}
                >
                  <span>{line}</span>
                </div>
              ))
            ) : (
              <p>주차 안내 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
