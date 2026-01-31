import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { websiteAPI } from '@/utils/api';

export function DirectorIntro() {
  const [directorData, setDirectorData] = useState({
    name: '야송 이원좌 李元佐 (1939-2019)',
    bio: '-',
    philosophy: '-',
    quote: '-',
    collection: '-',
  });
  const [directorImageUrl, setDirectorImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchDirectorData = async () => {
      try {
        const [nameData, bioData, philosophyData, quoteData, collectionData, imageData] = await Promise.all([
          websiteAPI.getTextSetting('director_name'),
          websiteAPI.getTextSetting('director_bio'),
          websiteAPI.getTextSetting('director_philosophy'),
          websiteAPI.getTextSetting('director_quote'),
          websiteAPI.getTextSetting('director_collection'),
          websiteAPI.getImage('director'),
        ]);

        setDirectorData({
          name: nameData.value || directorData.name,
          bio: bioData.value || directorData.bio,
          philosophy: philosophyData.value || directorData.philosophy,
          quote: quoteData.value || directorData.quote,
          collection: collectionData.value || directorData.collection,
        });

        if (imageData.imageUrl) {
          const imageUrl = imageData.imageUrl.startsWith('http') 
            ? imageData.imageUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${imageData.imageUrl}`;
          setDirectorImageUrl(imageUrl);
        }
      } catch (err) {
        console.error('초대관장 정보 로드 실패:', err);
        // 실패 시 기본값 사용
      }
    };

    fetchDirectorData();
  }, []);

  return (
    <section id="director" className="y-20 bg-gradient-to-b from-[#F4F4F0] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-[#2C2C2C]">초대 관장</h2>
          <div className="w-20 h-1 bg-[#C84630] mx-auto mb-6"></div>
          
          <h3 className="text-3xl text-[#2C2C2C]/80">
            {directorData.name}
          </h3>

          {/* 프로필 이미지 */}
          {directorImageUrl && (
            <div className="mb-8 flex justify-center">
              <div 
                className="relative w-64 h-80 overflow-hidden rounded-lg"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
                }}
              >
                <img 
                  src={directorImageUrl} 
                  alt="초대관장 프로필" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          

        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch mb-16">
          <div className="flex flex-col space-y-6">
            <div className="bg-[#F4F4F0] p-8 rounded-lg border-l-4 border-[#C84630] flex-1">
              <h4 className="text-2xl mb-4 text-[#2C2C2C]">화백 약력</h4>
              <div className="space-y-1 text-[#2C2C2C]/70">
                {directorData.bio.split('\n').filter(line => line.trim()).map((line, index) => (
                  <p key={index} className="leading-relaxed">
                    {line.trim().startsWith('•') ? line : `• ${line}`}
                  </p>
                ))}
              </div>
            </div>

    
          </div>

          <div className="flex flex-col space-y-6">
            <div className="bg-gradient-to-br from-[#2C2C2C] to-[#2C2C2C]/80 p-8 rounded-lg text-white flex-1">
              <h4 className="text-2xl mb-6 border-b-2 border-amber-400 pb-3">예술 세계</h4>
              <div className="space-y-4 leading-relaxed whitespace-pre-line">
                {directorData.philosophy}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-teal-200">
              <blockquote className="italic text-gray-700 text-center text-lg leading-relaxed whitespace-pre-line">
                {directorData.quote}
                <footer className="mt-4 text-teal-800 not-italic">- 이원좌</footer>
              </blockquote>
            </div>
          </div>
        </div>

        <div className="bg-teal-50 p-8 rounded-lg">
          <h4 className="text-2xl mb-6 text-center text-teal-900">주요 소장처</h4>
          <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto whitespace-pre-line">
            {directorData.collection}
          </p>
        </div>
      </div>
    </section>
  );
}
