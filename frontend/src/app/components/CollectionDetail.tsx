import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { collectionAPI, getFullImageUrl } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';
import { Header } from './Header';
import { Footer } from './Footer';
import { ArrowLeft, Edit2, Trash2, Pin, ChevronRight } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface Collection {
  id: number;
  title: string;
  year: string;
  size: string;
  imageUrl: string;
  description: string;
  artist: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [otherCollections, setOtherCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user && isManagerOrAbove(user.role);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await collectionAPI.getCollectionById(parseInt(id));
        setCollection(data);
        
        // 다른 소장품들 랜덤 5개 가져오기 (백엔드 API 사용)
        const randomCollections = await collectionAPI.getRandomCollections(5, parseInt(id));
        setOtherCollections(randomCollections);
        
        // SEO 설정
        setPageSEO({
          title: `${data.title} - 야송`,
          description: data.description,
          keywords: `${data.artist}, ${data.title}, 야송, 소장품`,
        });
      } catch (error) {
        console.error('소장품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [id]);

  const handleDelete = async () => {
    if (!collection || !confirm('정말 삭제하시겠습니까?')) return;

    try {
      await collectionAPI.deleteCollection(collection.id);
      alert('삭제되었습니다.');
      navigate('/collections');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    if (collection) {
      navigate(`/admin/collections/edit/${collection.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2C2C2C]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-[#F4F4F0] text-xl">로딩 중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#2C2C2C]">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#F4F4F0]">
          <h2 className="text-2xl font-bold mb-4">소장품을 찾을 수 없습니다</h2>
          <button
            onClick={() => navigate('/collections')}
            className="px-6 py-3 bg-[#C84630] hover:bg-[#A33520] transition-colors rounded-lg flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            목록으로 돌아가기
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C2C2C] flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate('/collections')}
          className="mb-8 flex items-center gap-2 text-[#F4F4F0] hover:text-[#C84630] transition-colors text-lg font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>목록으로 돌아가기</span>
        </button>

        {/* 이미지 섹션 */}
        <div className="relative mb-12">
          <div className="p-8 flex items-center justify-center">
            <ImageWithFallback
              src={getFullImageUrl(collection.imageUrl)}
              alt={collection.title}
              className="max-w-full max-h-[700px] object-contain"
            />
          </div>
          {collection.isPinned && (
            <div className="absolute top-4 right-4 bg-[#C84630] text-[#F4F4F0] px-4 py-2 rounded-full flex items-center shadow-lg">
              <Pin className="w-5 h-5 mr-2" />
              대표 소장품
            </div>
          )}
          
          {/* 관리자 버튼 */}
          {isAdmin && (
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

        {/* 정보 섹션 */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 작가 */}
          <div className="text-[#F4F4F0]/60 text-lg font-medium">
            {collection.artist}
          </div>

          {/* 제목 */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#F4F4F0] leading-tight">
            {collection.title}
          </h1>

          {/* 기본 정보 */}
          <div className="space-y-4 border-t border-[#F4F4F0]/20 pt-6">
            <div className="flex items-start gap-4">
              <span className="text-[#F4F4F0]/60 font-semibold min-w-[100px]">제작년도</span>
              <span className="text-[#F4F4F0]">{collection.year}</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#F4F4F0]/60 font-semibold min-w-[100px]">크기</span>
              <span className="text-[#F4F4F0]">{collection.size}</span>
            </div>
          </div>

          {/* 작품 설명 */}
          <div className="border-t border-[#F4F4F0]/20 pt-6">
            <h2 className="text-2xl font-bold text-[#F4F4F0] mb-4">작품 설명</h2>
            <p className="text-[#F4F4F0]/80 leading-relaxed whitespace-pre-wrap text-lg">
              {collection.description}
            </p>
          </div>
        </div>

        {/* 다른 소장품 섹션 */}
        {otherCollections.length > 0 && (
          <div className="mt-20 border-t border-[#F4F4F0]/20 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#F4F4F0]">다른 소장품</h2>
              <button
                onClick={() => navigate('/collections')}
                className="flex items-center gap-2 text-[#F4F4F0]/80 hover:text-[#C84630] transition-colors"
              >
                <span>전체보기</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {otherCollections.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => {
                    navigate(`/collections/${item.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {/* 이미지 */}
                  <div className="relative overflow-hidden flex justify-center h-[250px] items-end mb-0">
                    <ImageWithFallback
                      src={getFullImageUrl(item.imageUrl)}
                      alt={item.title}
                      className="w-[90%] max-h-full object-contain group-hover:opacity-90 transition-opacity duration-300"
                    />
                    {item.isPinned && (
                      <div className="absolute top-2 right-2 bg-[#C84630] text-[#F4F4F0] px-2 py-1 rounded-full flex items-center text-xs">
                        <Pin className="w-3 h-3 mr-1" />
                        고정
                      </div>
                    )}
                  </div>

                  {/* 구분선 */}
                  <div className="w-full h-px bg-[#F4F4F0]/20 mb-4"></div>

                  {/* 텍스트 정보 */}
                  <div className="flex flex-col">
                    {/* 작가 */}
                    <div className="text-xs text-[#F4F4F0]/60 font-medium mb-2">
                      {item.artist}
                    </div>

                    {/* 제목 */}
                    <h3 className="text-lg font-bold text-[#F4F4F0] group-hover:text-[#C84630] transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h3>

                    {/* 제작 연도 */}
                    <span className="inline-block px-2 py-1 bg-[#F4F4F0] text-[#2C2C2C] text-xs rounded-full w-fit">
                      {item.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
