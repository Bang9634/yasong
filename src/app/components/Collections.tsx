import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { collectionAPI } from '@/utils/api';

interface Artwork {
  id: number;
  title: string;
  year: string;
  size: string;
  imageUrl: string;
  description: string;
  displayOrder: number;
}

export function Collections() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const data = await collectionAPI.getAllCollections();
        // displayOrder로 정렬
        const sorted = data.sort((a: Artwork, b: Artwork) => a.displayOrder - b.displayOrder);
        setArtworks(sorted);
      } catch (err) {
        console.error('소장품 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // 이미지 URL 처리
  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${import.meta.env.VITE_API_BASE_URL || ''}${imageUrl}`;
  };

  if (isLoading) {
    return (
      <section id="collections" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="collections" className="py-20 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">대표 소장품</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            이원좌 화백의 예술 세계를 대표하는 주요 작품들을 만나보세요
          </p>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            등록된 소장품이 없습니다.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-teal-100"
                >
                  <div className="relative group">
                    <ImageWithFallback
                      src={getImageUrl(artwork.imageUrl)}
                      alt={artwork.title}
                      className="w-full h-72 object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/20 transition-colors"></div>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-b from-white to-teal-50">
                    <h3 className="text-2xl mb-2 text-teal-900">{artwork.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <p>{artwork.year}</p>
                      <p>{artwork.size}</p>
                    </div>
                    <p className="text-gray-700 leading-relaxed border-t border-teal-200 pt-4">
                      {artwork.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-700 p-8 rounded-lg">
              <h3 className="text-2xl mb-4 text-teal-900">소장품 안내</h3>
              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                <div>
                  <h4 className="text-teal-800 mb-3">상설 전시</h4>
                  <p className="leading-relaxed">
                    이원좌 화백의 대표작 청량대운도를 상설 전시하고 있습니다. 
                    청량대운도 전시관에서 작품을 한눈에 볼 수 있습니다.
                  </p>
                </div>
                <div>
                  <h4 className="text-teal-800 mb-3">순회 전시</h4>
                  <p className="leading-relaxed">
                    소장품 중 일부는 국내외 주요 미술관과의 교류 전시를 통해 
                    더 많은 관람객들에게 소개되고 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
