import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { websiteAPI } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';
import { resizeImage } from '@/utils/imageUtils';


export function WebsiteManagement() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Hero 이미지
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  const [isHeroImageLoading, setIsHeroImageLoading] = useState(false);

  // 초대관장 프로필 이미지
  const [directorImage, setDirectorImage] = useState<File | null>(null);
  const [directorImagePreview, setDirectorImagePreview] = useState<string>('');
  const [isDirectorImageLoading, setIsDirectorImageLoading] = useState(false);

  // 초대관장 정보
  const [directorData, setDirectorData] = useState({
    name: '',
    bio: '',
    philosophy: '',
    quote: '',
    collection: '',
  });
  const [isDirectorLoading, setIsDirectorLoading] = useState(false);

  // 권한 확인
  useEffect(() => {
    if (loading) return;
    
    if (!user || !isManagerOrAbove(user.role)) {
      alert('접근 권한이 없습니다.');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // 데이터 로드
  useEffect(() => {
    if (!user || !isManagerOrAbove(user.role)) return;
    
    const fetchData = async () => {
      try {
        // Hero 이미지 조회
        const heroData = await websiteAPI.getImage('hero');
        if (heroData.imageUrl) {
          const imageUrl = heroData.imageUrl.startsWith('http') 
            ? heroData.imageUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${heroData.imageUrl}`;
          setHeroImagePreview(imageUrl);
        }

        // 초대관장 프로필 이미지 조회
        const directorImageData = await websiteAPI.getImage('director');
        if (directorImageData.imageUrl) {
          const imageUrl = directorImageData.imageUrl.startsWith('http') 
            ? directorImageData.imageUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${directorImageData.imageUrl}`;
          setDirectorImagePreview(imageUrl);
        }

        // 초대관장 정보 조회
        const [nameData, bioData, philosophyData, quoteData, collectionData] = await Promise.all([
          websiteAPI.getTextSetting('director_name'),
          websiteAPI.getTextSetting('director_bio'),
          websiteAPI.getTextSetting('director_philosophy'),
          websiteAPI.getTextSetting('director_quote'),
          websiteAPI.getTextSetting('director_collection'),
        ]);

        setDirectorData({
          name: nameData.value || '',
          bio: bioData.value || '',
          philosophy: philosophyData.value || '',
          quote: quoteData.value || '',
          collection: collectionData.value || '',
        });

      } catch (err) {
        console.error('데이터 로드 실패:', err);
      }
    };

    fetchData();
  }, [user]);

  // Hero 이미지 파일 선택 및 리사이징
  const handleHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 이미지 리사이징 (최대 1920x1080)
      const resizedImage = await resizeImage(file, 1920, 1080);
      setHeroImage(resizedImage);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  // Hero 이미지 업로드
  const handleHeroImageUpload = async () => {
    if (!heroImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setIsHeroImageLoading(true);
      const response = await websiteAPI.uploadImage('hero',heroImage);
      alert(response.message || 'Hero 이미지가 업로드되었습니다.');
      setHeroImage(null);
      
      // 업로드된 이미지로 미리보기 업데이트
      const imageUrl = response.imageUrl.startsWith('http') 
        ? response.imageUrl 
        : `${import.meta.env.VITE_API_BASE_URL || ''}${response.imageUrl}`;
      setHeroImagePreview(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업로드에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsHeroImageLoading(false);
    }
  };

  // 초대관장 프로필 이미지 파일 선택 및 리사이징
  const handleDirectorImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 이미지 리사이징 (프로필 이미지는 800x800 정도로)
      const resizedImage = await resizeImage(file, 800, 800);
      setDirectorImage(resizedImage);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setDirectorImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  // 초대관장 프로필 이미지 업로드
  const handleDirectorImageUpload = async () => {
    if (!directorImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setIsDirectorImageLoading(true);
      const response = await websiteAPI.uploadImage('director', directorImage);
      alert(response.message || '초대관장 프로필 이미지가 업로드되었습니다.');
      setDirectorImage(null);
      
      // 업로드된 이미지로 미리보기 업데이트
      const imageUrl = response.imageUrl.startsWith('http') 
        ? response.imageUrl 
        : `${import.meta.env.VITE_API_BASE_URL || ''}${response.imageUrl}`;
      setDirectorImagePreview(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업로드에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsDirectorImageLoading(false);
    }
  };

  // 초대관장 정보 업데이트
  const handleDirectorDataUpdate = async () => {
    try {
      setIsDirectorLoading(true);
      await Promise.all([
        websiteAPI.updateTextSetting('director_name', directorData.name),
        websiteAPI.updateTextSetting('director_bio', directorData.bio),
        websiteAPI.updateTextSetting('director_philosophy', directorData.philosophy),
        websiteAPI.updateTextSetting('director_quote', directorData.quote),
        websiteAPI.updateTextSetting('director_collection', directorData.collection),
      ]);
      alert('초대관장 정보가 업데이트되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업데이트에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsDirectorLoading(false);
    }
  };


  if (loading || !user || !isManagerOrAbove(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-teal-900 mb-2">홈페이지 관리</h1>
            <p className="text-gray-600">웹사이트의 배경 이미지, 텍스트, 기념품 목록을 관리할 수 있습니다.</p>
          </div>

          <div className="space-y-6">
            {/* Hero 이미지 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hero 배경 이미지</h2>
              <p className="text-sm text-gray-600 mb-4">홈페이지 최상단 Hero 섹션의 배경 이미지를 변경할 수 있습니다.</p>
              <div className="space-y-4">
                {heroImagePreview && (
                  <div>
                    <Label>현재 이미지 미리보기</Label>
                    <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
                      <img 
                        src={heroImagePreview} 
                        alt="Hero 이미지 미리보기" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="heroImage">새 이미지 선택</Label>
                  <Input
                    id="heroImage"
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageChange}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">권장 크기: 1920x1080px 이상</p>
                </div>
                <Button
                  onClick={handleHeroImageUpload}
                  disabled={isHeroImageLoading || !heroImage}
                  className="bg-teal-700 hover:bg-teal-800 text-white"
                >
                  {isHeroImageLoading ? '업로드 중...' : 'Hero 이미지 업로드'}
                </Button>
              </div>
            </div>

            {/* 초대관장 프로필 이미지 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">초대관장 프로필 이미지</h2>
              <p className="text-sm text-gray-600 mb-4">초대관장 소개 섹션에 표시될 프로필 이미지를 변경할 수 있습니다.</p>
              <div className="space-y-4">
                {directorImagePreview && (
                  <div>
                    <Label>현재 이미지 미리보기</Label>
                    <div className="mt-2 border border-gray-300 rounded-md overflow-hidden flex justify-center">
                      <img 
                        src={directorImagePreview} 
                        alt="초대관장 프로필 이미지 미리보기" 
                        className="w-64 h-80 object-cover"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="directorImage">새 이미지 선택</Label>
                  <Input
                    id="directorImage"
                    type="file"
                    accept="image/*"
                    onChange={handleDirectorImageChange}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">권장 크기: 800x800px 이상 (세로 사진 권장)</p>
                </div>
                <Button
                  onClick={handleDirectorImageUpload}
                  disabled={isDirectorImageLoading || !directorImage}
                  className="bg-teal-700 hover:bg-teal-800 text-white"
                >
                  {isDirectorImageLoading ? '업로드 중...' : '프로필 이미지 업로드'}
                </Button>
              </div>
            </div>

            {/* 초대관장 정보 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">초대관장 정보</h2>
              <p className="text-sm text-gray-600 mb-4">홈페이지의 초대관장 소개 내용을 수정할 수 있습니다.</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="directorName">관장 이름</Label>
                  <Input
                    id="directorName"
                    type="text"
                    value={directorData.name}
                    onChange={(e) => setDirectorData({ ...directorData, name: e.target.value })}
                    placeholder="야송 이원좌 李元佐 (1939-2019)"
                  />
                </div>
                <div>
                  <Label htmlFor="directorBio">화백 약력</Label>
                  <Textarea
                    id="directorBio"
                    value={directorData.bio}
                    onChange={(e) => setDirectorData({ ...directorData, bio: e.target.value })}
                    placeholder="• 로 시작하는 각 줄바꿈 구분"
                    rows={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">각 항목을 줄바꿈으로 구분해주세요</p>
                </div>
                <div>
                  <Label htmlFor="directorPhilosophy">예술 세계</Label>
                  <Textarea
                    id="directorPhilosophy"
                    value={directorData.philosophy}
                    onChange={(e) => setDirectorData({ ...directorData, philosophy: e.target.value })}
                    placeholder="예술 철학 및 작품 세계에 대한 설명"
                    rows={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">단락 구분은 빈 줄로 해주세요</p>
                </div>
                <div>
                  <Label htmlFor="directorQuote">인용구</Label>
                  <Textarea
                    id="directorQuote"
                    value={directorData.quote}
                    onChange={(e) => setDirectorData({ ...directorData, quote: e.target.value })}
                    placeholder='"예술은 자연을 닮아가는 과정이며, 화가는 자연의 목소리를 전하는 사람이다."'
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="directorCollection">주요 소장처</Label>
                  <Textarea
                    id="directorCollection"
                    value={directorData.collection}
                    onChange={(e) => setDirectorData({ ...directorData, collection: e.target.value })}
                    placeholder="주요 소장처"
                    rows={5}
                  />
                </div>
                <Button
                  onClick={handleDirectorDataUpdate}
                  disabled={isDirectorLoading}
                  className="bg-teal-700 hover:bg-teal-800 text-white"
                >
                  {isDirectorLoading ? '저장 중...' : '초대관장 정보 저장'}
                </Button>
              </div>
            </div>


          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
