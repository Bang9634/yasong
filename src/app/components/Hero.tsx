import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { websiteAPI } from '@/utils/api';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1762860498297-4b6c3591b041?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGFzaWFuJTIwcGFpbnRpbmclMjBtb3VudGFpbnN8ZW58MXx8fHwxNzY4NDUzODE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function Hero() {
  const [heroImageUrl, setHeroImageUrl] = useState<string>(DEFAULT_IMAGE);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const data = await websiteAPI.getHeroImage();
        if (data.imageUrl) {
          // 백엔드 URL이 상대경로면 BASE_URL 추가
          const imageUrl = data.imageUrl.startsWith('http') 
            ? data.imageUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${data.imageUrl}`;
          setHeroImageUrl(imageUrl);
        }
      } catch (err) {
        console.error('Hero 이미지 로드 실패:', err);
        // 실패 시 기본 이미지 사용
      }
    };

    fetchHeroImage();
  }, []);

  return (
    <section id="hero" className="relative h-screen">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={heroImageUrl}
          alt="군립청송야송미술관"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/0 to-black/0" />
      </div>
      
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white px-4">
          <div className="mb-6">
            <div className="inline-block border-2 border-amber-400 px-8 py-4 mb-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.6)' }}>
                군립청송야송미술관
              </h1>
            </div>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl mb-4 text-amber-100 tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.6)' }}>
            이원좌 화백의 예술 세계
          </p>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.6)' }}>
            한국 근현대 미술의 거장, 이원좌 선생의 작품과 정신을 기리는 문화 공간
          </p>
        </div>
      </div>
      
      {/* 스크롤 힌트 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
