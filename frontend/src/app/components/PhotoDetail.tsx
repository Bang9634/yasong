import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { photoAPI } from '@/utils/api';
import { Edit2, Trash2, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { setPageSEO } from '@/utils/seo';

interface Photo {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export function PhotoDetail() {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user && isManagerOrAbove(user.role);

  useEffect(() => {
    if (id) {
      fetchPhoto();
    }
  }, [id]);

  const fetchPhoto = async () => {
    try {
      setIsLoading(true);
      const data = await photoAPI.getPhotoById(parseInt(id!));
      setPhoto(data);
      setPageSEO({
        title: data.title,
        description: data.description.substring(0, 160),
        keywords: `야송, 사진, ${data.title}`,
        image: getImageUrl(data.imageUrl),
      });
    } catch (error) {
      console.error('사진 자료 조회 실패:', error);
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

  const handleEdit = () => {
    navigate(`/photos/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 사진 자료를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await photoAPI.deletePhoto(parseInt(id!));
      alert('사진 자료가 삭제되었습니다.');
      navigate('/photos');
    } catch (error) {
      console.error('사진 자료 삭제 실패:', error);
      alert('사진 자료 삭제에 실패했습니다.');
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

  if (!photo) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#2C2C2C]/60">사진 자료를 찾을 수 없습니다.</p>
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
          onClick={() => navigate('/photos')}
          className="flex items-center gap-2 text-[#2C2C2C]/60 hover:text-[#C84630] transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>사진 목록으로</span>
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* 왼쪽: 이미지 */}
          <div className="space-y-6">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#2C2C2C]/10">
              <ImageWithFallback
                src={getImageUrl(photo.imageUrl)}
                alt={photo.title}
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
            </div>
          </div>

          {/* 오른쪽: 정보 */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-6 tracking-tight">
                {photo.title}
              </h1>

              {/* 메타 정보 */}
              <div className="space-y-4 border-t border-b border-[#2C2C2C]/10 py-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2C2C2C]/60">등록일</span>
                  <span className="text-[#2C2C2C] font-medium">
                    {new Date(photo.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {photo.updatedAt !== photo.createdAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#2C2C2C]/60">수정일</span>
                    <span className="text-[#2C2C2C] font-medium">
                      {new Date(photo.updatedAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 설명 */}
            <div>
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4">설명</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-[#2C2C2C]/80 whitespace-pre-wrap leading-relaxed">
                  {photo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
