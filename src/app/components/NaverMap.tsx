import { useEffect, useRef, useState } from 'react';
import { Navigation, RefreshCw } from 'lucide-react';

interface NaverMapProps {
  latitude: number;
  longitude: number;
  markerTitle?: string;
}

declare global {
  interface Window {
    naver: any;
  }
}

export function NaverMap({ latitude, longitude, markerTitle = '군립청송야송미술관' }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapError, setMapError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const resetMapPosition = () => {
    if (mapInstanceRef.current && window.naver && window.naver.maps) {
      const center = new window.naver.maps.LatLng(latitude, longitude);
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(16);
    }
  };

  useEffect(() => {
    // 네이버 지도 API가 로드될 때까지 대기
    const initMap = () => {
      // 최대 50번 재시도 (5초)
      if (retryCount > 50) {
        console.warn('네이버 지도 API를 로드할 수 없습니다.');
        setMapError(true);
        return;
      }

      if (!window.naver || !window.naver.maps) {
        setRetryCount(prev => prev + 1);
        setTimeout(initMap, 100);
        return;
      }

      if (!mapRef.current) return;

      try {
        const mapOptions = {
          center: new window.naver.maps.LatLng(latitude, longitude),
          zoom: 16,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;

        // 마커 추가
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(latitude, longitude),
          map: map,
          title: markerTitle,
        });
      } catch (error) {
        console.error('지도 초기화 중 오류:', error);
        setMapError(true);
      }
    };

    initMap();
  }, [latitude, longitude, markerTitle, retryCount]);

  if (mapError) {
    return (
      <div className="w-full h-[500px] rounded-lg border-4 border-teal-200 shadow-lg bg-gradient-to-br from-teal-100 via-teal-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Navigation className="w-20 h-20 text-teal-600 mx-auto mb-4" />
          <p className="text-2xl text-teal-800 mb-2">지도를 불러올 수 없습니다</p>
          <p className="text-gray-600 max-w-md mx-auto">
            네이버 지도 API 설정을 확인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-[500px] rounded-lg border-4 border-teal-200 shadow-lg"
      />
      <button
        onClick={resetMapPosition}
        className="absolute bottom-4 left-4 px-4 py-2 bg-white text-teal-700 rounded-lg shadow-lg hover:bg-teal-50 transition-colors flex items-center border-2 border-teal-200"
        title="지도 위치 초기화"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        위치 초기화
      </button>
    </div>
  );
}
