import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Building2, Users, Award, Home } from 'lucide-react';
import { websiteAPI } from '@/utils/api';

interface HistoryItem {
  year: string;
  description: string;
}

export function About() {
  const [mainBuildingImage, setMainBuildingImage] = useState<string>('');
  const [mainBuildingText, setMainBuildingText] = useState<string>('소개 정보가 없습니다.');
  
  const [cheongryangImage, setCheongryangImage] = useState<string>('');
  const [cheongryangText, setCheongryangText] = useState<string>('소개 정보가 없습니다.');

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    { year: '-', description: '연혁 정보가 없습니다.' }
  ]);

  const [facilitySiteArea, setFacilitySiteArea] = useState<string>('-');
  const [facilityExhibitionRooms, setFacilityExhibitionRooms] = useState<string>('-');
  const [facilityCollectionCount, setFacilityCollectionCount] = useState<string>('-');

  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        const [mainImageData, mainTextData, cheongryangImageData, cheongryangTextData, historyData, siteAreaData, exhibitionRoomsData, collectionCountData] = await Promise.all([
          websiteAPI.getImage('main_building'),
          websiteAPI.getTextSetting('main_building_description'),
          websiteAPI.getImage('cheongryangdae_building'),
          websiteAPI.getTextSetting('cheongryangdae_building_description'),
          websiteAPI.getTextSetting('museum_history'),
          websiteAPI.getTextSetting('facility_site_area'),
          websiteAPI.getTextSetting('facility_exhibition_rooms'),
          websiteAPI.getTextSetting('facility_collection_count'),
        ]);

        if (mainImageData.imageUrl) {
          const imageUrl = mainImageData.imageUrl.startsWith('http') 
            ? mainImageData.imageUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${mainImageData.imageUrl}`;
          setMainBuildingImage(imageUrl);
        }
        if (mainTextData.value) setMainBuildingText(mainTextData.value);

        if (cheongryangImageData.imageUrl) {
          const imageUrl = cheongryangImageData.imageUrl.startsWith('http') 
            ? cheongryangImageData.imageUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${cheongryangImageData.imageUrl}`;
          setCheongryangImage(imageUrl);
        }
        if (cheongryangTextData.value) setCheongryangText(cheongryangTextData.value);

        if (historyData.value) {
          try {
            const parsedHistory = JSON.parse(historyData.value);
            if (Array.isArray(parsedHistory)) {
              setHistoryItems(parsedHistory);
            }
          } catch (e) {
            console.error('연혁 데이터 파싱 실패:', e);
          }
        }

        if (siteAreaData.value) setFacilitySiteArea(siteAreaData.value);
        if (exhibitionRoomsData.value) setFacilityExhibitionRooms(exhibitionRoomsData.value);
        if (collectionCountData.value) setFacilityCollectionCount(collectionCountData.value);
      } catch (err) {
        console.error('건물 정보 로드 실패:', err);
      }
    };

    fetchBuildingData();
  }, []);

  return (
    <section id="about" className="py-20 y-20 bg-gradient-to-b from-white to-[#F4F4F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-[#2C2C2C]">전시관</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto"></div>
        </div>



        {/* 건물 소개 */}
        <div className="mt-20 mb-16">

          {/* 군립청송야송미술관 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-80">
                {mainBuildingImage ? (
                  <img 
                    src={mainBuildingImage} 
                    alt="군립청송야송미술관" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1565799515768-2dcfd834625c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5fGVufDF8fHx8MTc2ODQyOTg1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="군립청송야송미술관"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center mr-3">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-teal-900">군립청송야송미술관</h4>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {mainBuildingText}
                </p>
              </div>
            </div>
          </div>

          {/* 청량대운도전시관 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="order-2 md:order-1 p-8 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center mr-3">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-teal-900">청량대운도전시관</h4>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {cheongryangText}
                </p>
              </div>
              <div className="order-1 md:order-2 relative h-80">
                {cheongryangImage ? (
                  <img 
                    src={cheongryangImage} 
                    alt="청량대운도전시관" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1554907984-15263bfd63bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhcnQlMjBnYWxsZXJ5fGVufDF8fHx8MTc2ODQyOTg1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="청량대운도전시관"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>



        {/* 연혁 타임라인 */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-[#E0E0E0]">
          <h3 className="text-3xl mb-8 text-center text-[#2C2C2C]">주요 연혁</h3>
          <div className="space-y-6">
            {historyItems.map((item, index) => (
              <div 
                key={index}
                className={`flex items-start border-l-4 pl-6 py-2 ${
                  index === 0 ? 'border-teal-600' : 
                  index === historyItems.length - 1 ? 'border-amber-500' : 
                  'border-teal-500'
                }`}
              >
                <div className={`min-w-[100px] mr-6 ${
                  index === 0 ? 'text-teal-700' : 
                  index === historyItems.length - 1 ? 'text-amber-700' : 
                  'text-teal-700'
                }`}>
                  {item.year}
                </div>
                <div className="text-gray-700">{item.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 시설 규모 */}
        <div className="grid sm:grid-cols-3 gap-8 mt-12">
          <div className="text-center p-8 bg-teal-700 text-white rounded-lg shadow-lg">
            <div className="text-5xl mb-4">{facilitySiteArea}㎡</div>
            <div className="text-xl">전체 부지 면적</div>
          </div>
          <div className="text-center p-8 bg-teal-700 text-white rounded-lg shadow-lg">
            <div className="text-5xl mb-4">{facilityExhibitionRooms}개</div>
            <div className="text-xl">전시실 및 특별실</div>
          </div>
          <div className="text-center p-8 bg-teal-700 text-white rounded-lg shadow-lg">
            <div className="text-5xl mb-4">{facilityCollectionCount}점</div>
            <div className="text-xl">소장품 수</div>
          </div>
        </div>
      </div>
    </section>
  );
}
