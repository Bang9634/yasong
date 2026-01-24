import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { exhibitionAPI } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

interface Exhibition {
  id: number;
  title: string;
  artist: string;
  location: string;
  imageUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'ONGOING' | 'UPCOMING' | 'PAST';
}

export function Exhibitions() {
  const [currentExhibitions, setCurrentExhibitions] = useState<Exhibition[]>([]);
  const [upcomingExhibitions, setUpcomingExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        setIsLoading(true);
        const [ongoing, upcoming] = await Promise.all([
          exhibitionAPI.getOngoingExhibitions(),
          exhibitionAPI.getUpcomingExhibitions()
        ]);
        setCurrentExhibitions(ongoing);
        setUpcomingExhibitions(upcoming);
      } catch (err) {
        console.error('전시 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${import.meta.env.VITE_API_BASE_URL || ''}${imageUrl}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return <span className="px-3 py-1 bg-teal-600 text-white text-sm rounded-full">전시 중</span>;
      case 'UPCOMING':
        return <span className="px-3 py-1 bg-amber-500 text-white text-sm rounded-full">전시 예정</span>;
      case 'PAST':
        return <span className="px-3 py-1 bg-gray-400 text-white text-sm rounded-full">지난 전시</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <section id="exhibitions" className="py-20 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  const allExhibitions = [...currentExhibitions, ...upcomingExhibitions];

  return (
    <section id="exhibitions" className="py-20 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">전시 일정</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            청송야송미술관에서 만나볼 수 있는 특별한 전시들
          </p>
        </div>

        {allExhibitions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            현재 예정된 전시가 없습니다.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {allExhibitions.slice(0, 6).map((exhibition) => (
                <div
                  key={exhibition.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-teal-100"
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={getImageUrl(exhibition.imageUrl)}
                      alt={exhibition.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(exhibition.status)}
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-b from-white to-teal-50">
                    <h3 className="text-2xl mb-2 text-teal-900">{exhibition.title}</h3>
                    <p className="text-gray-600 mb-4">{exhibition.artist}</p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-teal-600" />
                        <span>{formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-teal-600" />
                        <span>{exhibition.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed border-t border-teal-200 pt-4 line-clamp-3">
                      {exhibition.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 전체 목록 보기 버튼 */}
            <div className="text-center">
              <button
                onClick={() => navigate('/exhibitions')}
                className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-lg transition-colors"
              >
                전체 전시 일정 보기
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
