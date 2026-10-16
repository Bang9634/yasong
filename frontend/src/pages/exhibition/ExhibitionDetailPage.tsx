import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { exhibitionAPI } from '@/utils/api';
import { Calendar, MapPin, Edit2, Trash2, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { setPageSEO } from '@/utils/seo';

interface Exhibition {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
  type: 'MEMORIAL' | 'RETROSPECTIVE';
  startDate: string;
  endDate: string;
  status: 'ONGOING' | 'UPCOMING' | 'PAST';
  createdAt: string;
  updatedAt: string;
}

export function ExhibitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user && isManagerOrAbove(user.role);

  useEffect(() => {
    if (id) {
      fetchExhibition();
    }
  }, [id]);

  const fetchExhibition = async () => {
    try {
      setIsLoading(true);
      const data = await exhibitionAPI.getExhibitionById(parseInt(id!));
      setExhibition(data);
      setPageSEO({
        title: data.title,
        description: data.description.substring(0, 160),
        keywords: `야송, 전시, ${data.title}, ${getTypeDisplayName(data.type)}`,
        image: getImageUrl(data.imageUrl),
      });
    } catch (error) {
      console.error('전시 정보 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${import.meta.env.VITE_API_BASE_URL || ''}${imageUrl}`;
  };

  const getTypeDisplayName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'MEMORIAL': '추모 전시',
      'RETROSPECTIVE': '회고전',
    };
    return typeMap[type] || type;
  };

  const getStatusDisplayName = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ONGOING': '전시 중',
      'UPCOMING': '전시 예정',
      'PAST': '지난 전시',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'ONGOING': 'bg-green-600',
      'UPCOMING': 'bg-blue-600',
      'PAST': 'bg-gray-600',
    };
    return colorMap[status] || 'bg-gray-600';
  };

  const handleEdit = () => {
    navigate(`/exhibitions/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 전시를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await exhibitionAPI.deleteExhibition(parseInt(id!));
      alert('전시가 삭제되었습니다.');
      navigate('/exhibitions');
    } catch (error) {
      console.error('전시 삭제 실패:', error);
      alert('전시 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#2C2C2C]/60">로딩 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#2C2C2C]/60">전시를 찾을 수 없습니다.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate('/exhibitions')}
          className="flex items-center gap-2 text-[#2C2C2C]/60 hover:text-[#C84630] transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>전시 목록으로</span>
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* 왼쪽: 이미지 */}
          <div className="space-y-6">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#2C2C2C]/10">
              <ImageWithFallback
                src={getImageUrl(exhibition.imageUrl)}
                alt={exhibition.title}
                className="w-full h-full object-cover"
              />
              
              {/* 관리자 버튼 - 좌측 상단 */}
              {canManage && (
                <div className="absolute top-4 left-4 flex gap-1 opacity-70 hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    className="w-8 h-8 bg-[#F4F4F0] text-[#2C2C2C] rounded-full hover:bg-[#C84630] hover:text-[#F4F4F0] transition-colors flex items-center justify-center shadow-lg"
                    title="수정"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="w-8 h-8 bg-[#F4F4F0]/90 text-[#2C2C2C] rounded-full hover:bg-red-600 hover:text-[#F4F4F0] transition-colors flex items-center justify-center shadow-lg"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {/* 타입 배지 - 우측 상단 */}
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded text-sm font-medium">
                {getTypeDisplayName(exhibition.type)}
              </div>
              
              {/* 상태 배지 - 우측 상단 (타입 아래) */}
              <div className={`absolute top-14 right-4 ${getStatusColor(exhibition.status)} text-white px-3 py-1.5 rounded text-sm font-medium`}>
                {getStatusDisplayName(exhibition.status)}
              </div>
            </div>
          </div>

          {/* 오른쪽: 정보 */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-6 tracking-tight">
                {exhibition.title}
              </h1>

              {/* 메타 정보 */}
              <div className="space-y-4 border-t border-b border-[#2C2C2C]/10 py-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#2C2C2C]/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#2C2C2C]/60 mb-1">전시 기간</p>
                    <p className="text-[#2C2C2C] font-medium">
                      {new Date(exhibition.startDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {' ~ '}
                      {new Date(exhibition.endDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2C2C2C]/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#2C2C2C]/60 mb-1">전시 장소</p>
                    <p className="text-[#2C2C2C] font-medium">{exhibition.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 설명 */}
            <div>
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4">전시 소개</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-[#2C2C2C]/80 whitespace-pre-wrap leading-relaxed">
                  {exhibition.description}
                </p>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="bg-white rounded-lg p-6 space-y-3">
              <h3 className="font-bold text-[#2C2C2C] mb-4">전시 정보</h3>
              <div className="flex justify-between text-sm">
                <span className="text-[#2C2C2C]/60">전시 유형</span>
                <span className="text-[#2C2C2C] font-medium">
                  {getTypeDisplayName(exhibition.type)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#2C2C2C]/60">전시 상태</span>
                <span className="text-[#2C2C2C] font-medium">
                  {getStatusDisplayName(exhibition.status)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#2C2C2C]/60">등록일</span>
                <span className="text-[#2C2C2C] font-medium">
                  {new Date(exhibition.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
