import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { websiteAPI } from '@/utils/api';

export function DirectorIntro() {
  const [directorData, setDirectorData] = useState({
    name: '야송 이원좌 李元佐 (1939-2019)',
    bio: '• 1941년 경상북도 청송 출생\n• 서울대학교 미술대학 회화과 졸업\n• 프랑스 파리 국립미술학교 수학\n• 대한민국 미술대전 심사위원 역임\n• 한국미술협회 이사장 역임\n• 서울대학교 미술대학 명예교수\n• 2020년 타계, 금관문화훈장 추서',
    philosophy: '이원좌 화백은 한국 근현대 미술사에서 독보적인 위치를 차지하는 서양화가입니다. 그의 작품은 동양의 정신성과 서양의 조형성을 조화롭게 융합하여 독창적인 예술 세계를 구축했습니다.\n\n특히 고향 청송의 자연을 주제로 한 풍경화는 한국적 정서와 현대적 감각이 어우러진 걸작으로 평가받고 있습니다. 맑고 투명한 색채와 서정적인 구도는 보는 이로 하여금 자연의 숭고함과 생명의 신비를 느끼게 합니다.\n\n평생 동안 500여 회의 개인전과 1,000여 회의 단체전에 참여하며 한국 미술의 위상을 세계에 알렸으며, 후학 양성에도 헌신하여 많은 제자들을 배출했습니다.',
    quote: '"예술은 자연을 닮아가는 과정이며, 화가는 자연의 목소리를 전하는 사람이다."',
    collection: '주요 소장처',
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
    <section id="director" className="y-20 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">초대 관장</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          
          <h3 className="text-3xl text-teal-800">
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
            <div className="bg-teal-50 p-8 rounded-lg border-l-4 border-teal-700 flex-1">
              <h4 className="text-2xl mb-4 text-teal-900">화백 약력</h4>
              <div className="space-y-1 text-gray-700">
                {directorData.bio.split('\n').filter(line => line.trim()).map((line, index) => (
                  <p key={index} className="leading-relaxed">
                    {line.trim().startsWith('•') ? line : `• ${line}`}
                  </p>
                ))}
              </div>
            </div>

    
          </div>

          <div className="flex flex-col space-y-6">
            <div className="bg-gradient-to-br from-teal-900 to-teal-700 p-8 rounded-lg text-white flex-1">
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
