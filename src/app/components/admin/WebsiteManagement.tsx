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
import { Plus, Trash2 } from 'lucide-react';

interface HistoryItem {
  year: string;
  description: string;
}

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

  // 본관 건물
  const [mainBuildingImage, setMainBuildingImage] = useState<File | null>(null);
  const [mainBuildingImagePreview, setMainBuildingImagePreview] = useState<string>('');
  const [mainBuildingText, setMainBuildingText] = useState<string>('');
  const [isMainBuildingLoading, setIsMainBuildingLoading] = useState(false);

  // 청량대운도전시관
  const [cheongryangImage, setCheongryangImage] = useState<File | null>(null);
  const [cheongryangImagePreview, setCheongryangImagePreview] = useState<string>('');
  const [cheongryangText, setCheongryangText] = useState<string>('');
  const [isCheongryangLoading, setIsCheongryangLoading] = useState(false);

  // 미술관 연혁
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [newHistoryYear, setNewHistoryYear] = useState<string>('');
  const [newHistoryDescription, setNewHistoryDescription] = useState<string>('');
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

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

        // 본관 건물 정보 조회
        const mainBuildingImageData = await websiteAPI.getImage('main_building');
        if (mainBuildingImageData.imageUrl) {
          const imageUrl = mainBuildingImageData.imageUrl.startsWith('http') 
            ? mainBuildingImageData.imageUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${mainBuildingImageData.imageUrl}`;
          setMainBuildingImagePreview(imageUrl);
        }
        const mainBuildingTextData = await websiteAPI.getTextSetting('main_building_description');
        setMainBuildingText(mainBuildingTextData.value || '');

        // 청량대운도전시관 정보 조회
        const cheongryangImageData = await websiteAPI.getImage('cheongryangdae_building');
        if (cheongryangImageData.imageUrl) {
          const imageUrl = cheongryangImageData.imageUrl.startsWith('http') 
            ? cheongryangImageData.imageUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${cheongryangImageData.imageUrl}`;
          setCheongryangImagePreview(imageUrl);
        }
        const cheongryangTextData = await websiteAPI.getTextSetting('cheongryangdae_building_description');
        setCheongryangText(cheongryangTextData.value || '');

        // 미술관 연혁 조회
        const historyData = await websiteAPI.getTextSetting('museum_history');
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

  // 본관 건물 이미지 파일 선택 및 리사이징
  const handleMainBuildingImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 1920, 1080);
      setMainBuildingImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMainBuildingImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  // 본관 건물 이미지 업로드
  const handleMainBuildingImageUpload = async () => {
    if (!mainBuildingImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setIsMainBuildingLoading(true);
      const response = await websiteAPI.uploadImage('main_building', mainBuildingImage);
      alert(response.message || '본관 건물 이미지가 업로드되었습니다.');
      setMainBuildingImage(null);
      
      const imageUrl = response.imageUrl.startsWith('http') 
        ? response.imageUrl 
        : `${import.meta.env.VITE_API_BASE_URL || ''}${response.imageUrl}`;
      setMainBuildingImagePreview(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업로드에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsMainBuildingLoading(false);
    }
  };

  // 본관 건물 텍스트 업데이트
  const handleMainBuildingTextUpdate = async () => {
    try {
      setIsMainBuildingLoading(true);
      await websiteAPI.updateTextSetting('main_building_description', mainBuildingText);
      alert('본관 건물 소개가 업데이트되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업데이트에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsMainBuildingLoading(false);
    }
  };

  // 청량대운도전시관 이미지 파일 선택 및 리사이징
  const handleCheongryangImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 1920, 1080);
      setCheongryangImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCheongryangImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  // 청량대운도전시관 이미지 업로드
  const handleCheongryangImageUpload = async () => {
    if (!cheongryangImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setIsCheongryangLoading(true);
      const response = await websiteAPI.uploadImage('cheongryangdae_building', cheongryangImage);
      alert(response.message || '청량대운도전시관 이미지가 업로드되었습니다.');
      setCheongryangImage(null);
      
      const imageUrl = response.imageUrl.startsWith('http') 
        ? response.imageUrl 
        : `${import.meta.env.VITE_API_BASE_URL || ''}${response.imageUrl}`;
      setCheongryangImagePreview(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업로드에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsCheongryangLoading(false);
    }
  };

  // 청량대운도전시관 텍스트 업데이트
  const handleCheongryangTextUpdate = async () => {
    try {
      setIsCheongryangLoading(true);
      await websiteAPI.updateTextSetting('cheongryangdae_building_description', cheongryangText);
      alert('청량대운도전시관 소개가 업데이트되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업데이트에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsCheongryangLoading(false);
    }
  };

  // 연혁 항목 추가
  const handleAddHistoryItem = () => {
    if (!newHistoryYear.trim() || !newHistoryDescription.trim()) {
      alert('연도와 내용을 모두 입력해주세요.');
      return;
    }

    const newItem: HistoryItem = {
      year: newHistoryYear.trim(),
      description: newHistoryDescription.trim(),
    };

    setHistoryItems([...historyItems, newItem]);
    setNewHistoryYear('');
    setNewHistoryDescription('');
  };

  // 연혁 항목 수정
  const handleUpdateHistoryItem = (index: number, field: 'year' | 'description', value: string) => {
    const updated = [...historyItems];
    updated[index][field] = value;
    setHistoryItems(updated);
  };

  // 연혁 항목 삭제
  const handleDeleteHistoryItem = (index: number) => {
    if (!confirm('이 연혁 항목을 삭제하시겠습니까?')) return;
    setHistoryItems(historyItems.filter((_, i) => i !== index));
  };

  // 연혁 전체 저장
  const handleSaveHistory = async () => {
    try {
      setIsHistoryLoading(true);
      const jsonValue = JSON.stringify(historyItems);
      await websiteAPI.updateTextSetting('museum_history', jsonValue);
      alert('미술관 연혁이 저장되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '저장에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsHistoryLoading(false);
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

            {/* 본관 건물 이미지 및 텍스트 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">군립청송야송미술관 (본관)</h2>
              <p className="text-sm text-gray-600 mb-4">본관 건물 이미지와 소개 텍스트를 관리할 수 있습니다.</p>
              <div className="space-y-4">
                {mainBuildingImagePreview && (
                  <div>
                    <Label>현재 이미지 미리보기</Label>
                    <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
                      <img 
                        src={mainBuildingImagePreview} 
                        alt="본관 건물 이미지 미리보기" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="mainBuildingImage">건물 이미지 선택</Label>
                  <Input
                    id="mainBuildingImage"
                    type="file"
                    accept="image/*"
                    onChange={handleMainBuildingImageChange}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">권장 크기: 1920x1080px</p>
                </div>
                <Button
                  onClick={handleMainBuildingImageUpload}
                  disabled={isMainBuildingLoading || !mainBuildingImage}
                  className="bg-teal-700 hover:bg-teal-800 text-white"
                >
                  {isMainBuildingLoading ? '업로드 중...' : '본관 이미지 업로드'}
                </Button>
                
                <div className="border-t pt-4 mt-4">
                  <Label htmlFor="mainBuildingText">건물 소개</Label>
                  <Textarea
                    id="mainBuildingText"
                    value={mainBuildingText}
                    onChange={(e) => setMainBuildingText(e.target.value)}
                    placeholder="군립청송야송미술관 소개 텍스트를 입력하세요"
                    rows={4}
                  />
                  <Button
                    onClick={handleMainBuildingTextUpdate}
                    disabled={isMainBuildingLoading}
                    className="bg-teal-700 hover:bg-teal-800 text-white mt-2"
                  >
                    {isMainBuildingLoading ? '저장 중...' : '본관 소개 저장'}
                  </Button>
                </div>
              </div>
            </div>

            {/* 청량대운도전시관 이미지 및 텍스트 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">청량대운도전시관</h2>
              <p className="text-sm text-gray-600 mb-4">청량대운도전시관 건물 이미지와 소개 텍스트를 관리할 수 있습니다.</p>
              <div className="space-y-4">
                {cheongryangImagePreview && (
                  <div>
                    <Label>현재 이미지 미리보기</Label>
                    <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
                      <img 
                        src={cheongryangImagePreview} 
                        alt="청량대운도전시관 이미지 미리보기" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="cheongryangImage">건물 이미지 선택</Label>
                  <Input
                    id="cheongryangImage"
                    type="file"
                    accept="image/*"
                    onChange={handleCheongryangImageChange}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">권장 크기: 1920x1080px</p>
                </div>
                <Button
                  onClick={handleCheongryangImageUpload}
                  disabled={isCheongryangLoading || !cheongryangImage}
                  className="bg-teal-700 hover:bg-teal-800 text-white"
                >
                  {isCheongryangLoading ? '업로드 중...' : '청량대운도전시관 이미지 업로드'}
                </Button>
                
                <div className="border-t pt-4 mt-4">
                  <Label htmlFor="cheongryangText">건물 소개</Label>
                  <Textarea
                    id="cheongryangText"
                    value={cheongryangText}
                    onChange={(e) => setCheongryangText(e.target.value)}
                    placeholder="청량대운도전시관 소개 텍스트를 입력하세요"
                    rows={4}
                  />
                  <Button
                    onClick={handleCheongryangTextUpdate}
                    disabled={isCheongryangLoading}
                    className="bg-teal-700 hover:bg-teal-800 text-white mt-2"
                  >
                    {isCheongryangLoading ? '저장 중...' : '청량대운도전시관 소개 저장'}
                  </Button>
                </div>
              </div>
            </div>

            {/* 미술관 연혁 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">미술관 주요 연혁</h2>
              <p className="text-sm text-gray-600 mb-4">미술관의 주요 연혁을 관리할 수 있습니다. 연도와 내용을 입력하여 추가하세요.</p>
              
              {/* 새 항목 추가 폼 */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">새 연혁 추가</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="newHistoryYear">연도</Label>
                    <Input
                      id="newHistoryYear"
                      type="text"
                      value={newHistoryYear}
                      onChange={(e) => setNewHistoryYear(e.target.value)}
                      placeholder="예: 2020년"
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="newHistoryDescription">내용</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="newHistoryDescription"
                        type="text"
                        value={newHistoryDescription}
                        onChange={(e) => setNewHistoryDescription(e.target.value)}
                        placeholder="예: 군립청송야송미술관 개관"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddHistoryItem()}
                      />
                      <Button
                        onClick={handleAddHistoryItem}
                        className="bg-teal-700 hover:bg-teal-800 text-white whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        추가
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 기존 항목 목록 */}
              <div className="space-y-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">현재 연혁 목록</h3>
                {historyItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">등록된 연혁이 없습니다.</p>
                ) : (
                  historyItems.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          type="text"
                          value={item.year}
                          onChange={(e) => handleUpdateHistoryItem(index, 'year', e.target.value)}
                          placeholder="연도"
                        />
                        <Input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateHistoryItem(index, 'description', e.target.value)}
                          placeholder="내용"
                          className="md:col-span-2"
                        />
                      </div>
                      <Button
                        onClick={() => handleDeleteHistoryItem(index)}
                        variant="destructive"
                        size="icon"
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {/* 저장 버튼 */}
              <Button
                onClick={handleSaveHistory}
                disabled={isHistoryLoading || historyItems.length === 0}
                className="bg-teal-700 hover:bg-teal-800 text-white w-full"
              >
                {isHistoryLoading ? '저장 중...' : '연혁 저장'}
              </Button>
            </div>


          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
