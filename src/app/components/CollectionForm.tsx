import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { collectionAPI, getFullImageUrl } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';
import { Header } from './Header';
import { Footer } from './Footer';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';

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

export function CollectionForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // 권한 체크
  useEffect(() => {
    if (!user || !isManagerOrAbove(user.role)) {
      alert('접근 권한이 없습니다.');
      navigate('/collections');
      return;
    }

    if (isEditing && id) {
      loadCollection(parseInt(id));
    }

    setPageSEO({
      title: isEditing ? '소장품 수정' : '소장품 추가',
      description: '야송미술관 소장품 관리',
      keywords: '야송미술관, 소장품, 관리',
    });
  }, [id, user, navigate, isEditing]);

  const loadCollection = async (collectionId: number) => {
    try {
      setLoading(true);
      const data = await collectionAPI.getCollectionById(collectionId.toString());
      setTitle(data.title);
      setYear(data.year);
      setSize(data.size);
      setDescription(data.description);
      setArtist(data.artist);
      setIsPinned(data.isPinned);
      setImagePreview(getFullImageUrl(data.imageUrl));
    } catch (error) {
      console.error('소장품 로드 실패:', error);
      alert('소장품을 불러오는데 실패했습니다.');
      navigate('/collections');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !year || !size || !description || !artist) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!isEditing && !imageFile) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setLoading(true);

      if (isEditing && id) {
        await collectionAPI.updateCollection(id, {
          title,
          year,
          size,
          description,
          artist,
          isPinned,
          imageFile: imageFile || undefined,
        });
        alert('소장품이 수정되었습니다.');
      } else {
        await collectionAPI.createCollection({
          title,
          year,
          size,
          description,
          artist,
          isPinned,
          imageFile: imageFile!,
        });
        alert('소장품이 추가되었습니다.');
      }

      navigate('/collections');
    } catch (error) {
      console.error('소장품 저장 실패:', error);
      alert('소장품 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
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

  return (
    <div className="min-h-screen bg-[#2C2C2C]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate('/collections')}
          className="mb-8 flex items-center gap-2 text-[#F4F4F0] hover:text-[#C84630] transition-colors text-lg font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>목록으로 돌아가기</span>
        </button>

        {/* 페이지 제목 */}
        <h1 className="text-4xl font-bold text-[#F4F4F0] mb-8">
          {isEditing ? '소장품 수정' : '소장품 추가'}
        </h1>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 이미지 업로드 섹션 */}
          <div className="bg-[#F4F4F0]/5 rounded-lg p-6 border border-[#F4F4F0]/20">
            <label className="block text-[#F4F4F0] font-medium mb-4 text-lg">작품 이미지</label>
            
            {/* 이미지 미리보기 */}
            {imagePreview ? (
              <div className="relative mb-4">
                <img
                  src={imagePreview}
                  alt="미리보기"
                  className="max-h-96 mx-auto object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#F4F4F0]/30 rounded-lg p-12 text-center mb-4">
                <Upload className="w-16 h-16 text-[#F4F4F0]/40 mx-auto mb-4" />
                <p className="text-[#F4F4F0]/60 mb-2">이미지를 선택해주세요</p>
                <p className="text-[#F4F4F0]/40 text-sm">JPG, PNG (최대 10MB)</p>
              </div>
            )}
            
            {/* 이미지 업로드 버튼 */}
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="px-6 py-3 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors cursor-pointer text-center font-medium">
                <Upload className="w-5 h-5 inline-block mr-2" />
                {imagePreview ? '다른 이미지 선택' : '이미지 업로드'}
              </div>
            </label>
          </div>

          {/* 기본 정보 (2x2 그리드) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 작가 */}
            <div className="flex items-center gap-3">
              <label className="text-[#F4F4F0] font-medium whitespace-nowrap w-20">작가</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0]"
                placeholder="작가명을 입력하세요"
                required
              />
            </div>

            {/* 작품명 */}
            <div className="flex items-center gap-3">
              <label className="text-[#F4F4F0] font-medium whitespace-nowrap w-20">작품명</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0]"
                placeholder="작품명을 입력하세요"
                required
              />
            </div>

            {/* 제작년도 */}
            <div className="flex items-center gap-3">
              <label className="text-[#F4F4F0] font-medium whitespace-nowrap w-20">제작년도</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0]"
                placeholder="예: 1980, 1980년, 1980-1981"
                required
              />
            </div>

            {/* 크기 */}
            <div className="flex items-center gap-3">
              <label className="text-[#F4F4F0] font-medium whitespace-nowrap w-20">크기</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0]"
                placeholder="예: 45.5 x 53.0 cm"
                required
              />
            </div>
          </div>

          {/* 작품 설명 */}
          <div>
            <label className="block text-[#F4F4F0] font-medium mb-2">작품 설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={18}
              className="w-full px-4 py-3 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0] resize-none"
              placeholder="작품에 대한 설명을 입력하세요"
              required
            />
          </div>

          {/* 대표 작품 설정 */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPinned"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-5 h-5 rounded border-[#F4F4F0]/20 bg-[#F4F4F0]/10 text-[#C84630] focus:ring-[#C84630]"
            />
            <label htmlFor="isPinned" className="text-[#F4F4F0] font-medium cursor-pointer">
              대표 작품으로 설정 (홈페이지에 표시)
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className="flex-1 px-6 py-3 bg-[#F4F4F0]/10 text-[#F4F4F0] rounded-lg hover:bg-[#F4F4F0]/20 transition-colors font-medium border border-[#F4F4F0]/30"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? '저장 중...' : isEditing ? '수정 완료' : '추가 완료'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
