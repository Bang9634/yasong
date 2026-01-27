import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ShoppingBag } from 'lucide-react';
import { souvenirAPI, getFullImageUrl } from '@/utils/api';

interface Souvenir {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export function MuseumShop() {
  const navigate = useNavigate();
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSouvenirs();
  }, []);

  const loadSouvenirs = async () => {
    try {
      const data = await souvenirAPI.getAllSouvenirs();
      // isPinned가 true인 것만 최대 6개까지 표시
      const pinnedSouvenirs = data.filter((s: Souvenir) => s.isPinned).slice(0, 6);
      setSouvenirs(pinnedSouvenirs);
    } catch (error) {
      console.error('Failed to load souvenirs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}원`;
  };

  if (loading) {
    return (
      <section id="shop" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">로딩 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-teal-800 mr-3" />
            <h2 className="text-4xl sm:text-5xl text-teal-900">기념품</h2>
          </div>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            이원좌 화백의 예술 세계를 담은 다양한 문화상품을 만나보세요
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            * 청량대운도전시관에서 구매하실 수 있습니다
          </p>
        </div>

        {souvenirs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            등록된 기념품이 없습니다.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {souvenirs.map((souvenir) => (
                <div
                  key={souvenir.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-teal-100 group"
                >
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={getFullImageUrl(souvenir.imageUrl)}
                      alt={souvenir.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl mb-2 text-teal-900">{souvenir.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {souvenir.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl text-teal-700">{formatPrice(souvenir.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/souvenirs')}
                className="px-8 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-lg font-semibold"
              >
                기념품 더보기
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
