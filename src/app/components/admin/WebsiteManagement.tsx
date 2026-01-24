import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { websiteAPI, collectionAPI, exhibitionAPI } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';
import { resizeImage } from '@/utils/imageUtils';
import { Plus, Trash2, Edit, Upload, Calendar } from 'lucide-react';

interface HistoryItem {
  year: string;
  description: string;
}

interface Collection {
  id: number;
  title: string;
  year: string;
  size: string;
  imageUrl: string;
  description: string;
  displayOrder: number;
}

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

  // 시설 규모
  const [facilitySiteArea, setFacilitySiteArea] = useState<string>('');
  const [facilityExhibitionRooms, setFacilityExhibitionRooms] = useState<string>('');
  const [facilityCollectionCount, setFacilityCollectionCount] = useState<string>('');
  const [isFacilityLoading, setIsFacilityLoading] = useState(false);

  // 소장품 관리
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    title: '',
    year: '',
    size: '',
    description: '',
    displayOrder: 0,
  });
  const [collectionImage, setCollectionImage] = useState<File | null>(null);
  const [collectionImagePreview, setCollectionImagePreview] = useState<string>('');

  // 전시 관리
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isExhibitionLoading, setIsExhibitionLoading] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);
  const [showExhibitionForm, setShowExhibitionForm] = useState(false);
  const [exhibitionForm, setExhibitionForm] = useState({
    title: '',
    artist: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [exhibitionImage, setExhibitionImage] = useState<File | null>(null);
  const [exhibitionImagePreview, setExhibitionImagePreview] = useState<string>('');

  // 공모전 관리
  const [contestData, setContestData] = useState({
    title: '',
    subtitle: '',
    content: '',
    imageUrl: '',
    isActive: true,
    introLink: '',
    noticeLink: '',
  });
  const [contestImage, setContestImage] = useState<File | null>(null);
  const [contestImagePreview, setContestImagePreview] = useState<string>('');
  const [isContestLoading, setIsContestLoading] = useState(false);

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

        // 시설 규모 조회
        const [siteAreaData, exhibitionRoomsData, collectionCountData] = await Promise.all([
          websiteAPI.getTextSetting('facility_site_area'),
          websiteAPI.getTextSetting('facility_exhibition_rooms'),
          websiteAPI.getTextSetting('facility_collection_count'),
        ]);
        setFacilitySiteArea(siteAreaData.value || '');
        setFacilityExhibitionRooms(exhibitionRoomsData.value || '');
        setFacilityCollectionCount(collectionCountData.value || '');

        // 소장품 조회
        const collectionsData = await collectionAPI.getAllCollections();
        setCollections(collectionsData.sort((a, b) => a.displayOrder - b.displayOrder));

        // 공모전 조회
        const [contestTitleData, contestSubtitleData, contestContentData, contestImageData, contestActiveData, contestIntroLinkData, contestNoticeLinkData] = await Promise.all([
          websiteAPI.getTextSetting('contest_title'),
          websiteAPI.getTextSetting('contest_subtitle'),
          websiteAPI.getTextSetting('contest_content'),
          websiteAPI.getImage('contest_poster'),
          websiteAPI.getTextSetting('contest_active'),
          websiteAPI.getTextSetting('contest_intro_link'),
          websiteAPI.getTextSetting('contest_notice_link'),
        ]);
        
        setContestData({
          title: contestTitleData.value || '',
          subtitle: contestSubtitleData.value || '',
          content: contestContentData.value || '',
          imageUrl: contestImageData.imageUrl || '',
          isActive: contestActiveData.value === 'true',
          introLink: contestIntroLinkData.value || '',
          noticeLink: contestNoticeLinkData.value || '',
        });
        
        if (contestImageData.imageUrl) {
          const imageUrl = contestImageData.imageUrl.startsWith('http')
            ? contestImageData.imageUrl
            : `${import.meta.env.VITE_API_BASE_URL || ''}${contestImageData.imageUrl}`;
          setContestImagePreview(imageUrl);
        }

        // 전시 조회
        const exhibitionsData = await exhibitionAPI.getAllExhibitions();
        setExhibitions(exhibitionsData);

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

  // 시설 규모 저장
  const handleSaveFacility = async () => {
    try {
      setIsFacilityLoading(true);
      await Promise.all([
        websiteAPI.updateTextSetting('facility_site_area', facilitySiteArea),
        websiteAPI.updateTextSetting('facility_exhibition_rooms', facilityExhibitionRooms),
        websiteAPI.updateTextSetting('facility_collection_count', facilityCollectionCount),
      ]);
      alert('시설 규모 정보가 저장되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '저장에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsFacilityLoading(false);
    }
  };

  // 소장품 이미지 선택 및 리사이징
  const handleCollectionImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 1200, 1200);
      setCollectionImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCollectionImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  // 소장품 추가 폼 열기
  const handleOpenAddCollectionForm = () => {
    setEditingCollection(null);
    setCollectionForm({
      title: '',
      year: '',
      size: '',
      description: '',
      displayOrder: collections.length > 0 ? Math.max(...collections.map(c => c.displayOrder)) + 1 : 1,
    });
    setCollectionImage(null);
    setCollectionImagePreview('');
    setShowCollectionForm(true);
  };

  // 소장품 수정 폼 열기
  const handleOpenEditCollectionForm = (collection: Collection) => {
    setEditingCollection(collection);
    setCollectionForm({
      title: collection.title,
      year: collection.year,
      size: collection.size,
      description: collection.description,
      displayOrder: collection.displayOrder,
    });
    setCollectionImage(null);
    
    const imageUrl = collection.imageUrl.startsWith('http') 
      ? collection.imageUrl 
      : `${import.meta.env.VITE_API_BASE_URL || ''}${collection.imageUrl}`;
    setCollectionImagePreview(imageUrl);
    setShowCollectionForm(true);
  };

  // 소장품 폼 취소
  const handleCancelCollectionForm = () => {
    setShowCollectionForm(false);
    setEditingCollection(null);
    setCollectionForm({
      title: '',
      year: '',
      size: '',
      description: '',
      displayOrder: 0,
    });
    setCollectionImage(null);
    setCollectionImagePreview('');
  };

  // 소장품 생성
  const handleCreateCollection = async () => {
    if (!collectionForm.title || !collectionForm.year || !collectionForm.size || !collectionForm.description) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    if (!collectionImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setIsCollectionLoading(true);
      await collectionAPI.createCollection(collectionForm, collectionImage);
      
      // 목록 새로고침
      const updated = await collectionAPI.getAllCollections();
      setCollections(updated.sort((a, b) => a.displayOrder - b.displayOrder));
      
      alert('소장품이 추가되었습니다.');
      handleCancelCollectionForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '추가에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsCollectionLoading(false);
    }
  };

  // 소장품 수정
  const handleUpdateCollection = async () => {
    if (!editingCollection) return;
    
    if (!collectionForm.title || !collectionForm.year || !collectionForm.size || !collectionForm.description) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      setIsCollectionLoading(true);
      await collectionAPI.updateCollection(editingCollection.id, collectionForm, collectionImage || undefined);
      
      // 목록 새로고침
      const updated = await collectionAPI.getAllCollections();
      setCollections(updated.sort((a, b) => a.displayOrder - b.displayOrder));
      
      alert('소장품이 수정되었습니다.');
      handleCancelCollectionForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '수정에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsCollectionLoading(false);
    }
  };

  // 소장품 삭제
  const handleDeleteCollection = async (id: number) => {
    if (!confirm('이 소장품을 삭제하시겠습니까?')) return;

    try {
      setIsCollectionLoading(true);
      await collectionAPI.deleteCollection(id);
      
      // 목록 새로고침
      const updated = await collectionAPI.getAllCollections();
      setCollections(updated.sort((a, b) => a.displayOrder - b.displayOrder));
      
      alert('소장품이 삭제되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsCollectionLoading(false);
    }
  };

  // 전시 이미지 선택 및 리사이징
  const handleExhibitionImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 1200, 800);
      setExhibitionImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setExhibitionImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  // 전시 추가 폼 열기
  const handleOpenAddExhibitionForm = () => {
    setEditingExhibition(null);
    setExhibitionForm({
      title: '',
      artist: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
    });
    setExhibitionImage(null);
    setExhibitionImagePreview('');
    setShowExhibitionForm(true);
  };

  // 전시 수정 폼 열기
  const handleOpenEditExhibitionForm = (exhibition: Exhibition) => {
    setEditingExhibition(exhibition);
    
    // LocalDateTime을 date input 형식으로 변환 (YYYY-MM-DD)
    const startDate = new Date(exhibition.startDate).toISOString().slice(0, 10);
    const endDate = new Date(exhibition.endDate).toISOString().slice(0, 10);
    
    setExhibitionForm({
      title: exhibition.title,
      artist: exhibition.artist,
      location: exhibition.location,
      description: exhibition.description,
      startDate: startDate,
      endDate: endDate,
    });
    setExhibitionImage(null);
    
    const imageUrl = exhibition.imageUrl.startsWith('http') 
      ? exhibition.imageUrl 
      : `${import.meta.env.VITE_API_BASE_URL || ''}${exhibition.imageUrl}`;
    setExhibitionImagePreview(imageUrl);
    setShowExhibitionForm(true);
  };

  // 전시 폼 취소
  const handleCancelExhibitionForm = () => {
    setShowExhibitionForm(false);
    setEditingExhibition(null);
    setExhibitionForm({
      title: '',
      artist: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
    });
    setExhibitionImage(null);
    setExhibitionImagePreview('');
  };

  // 전시 생성
  const handleCreateExhibition = async () => {
    if (!exhibitionForm.title || !exhibitionForm.artist || !exhibitionForm.location || 
        !exhibitionForm.description || !exhibitionForm.startDate || !exhibitionForm.endDate) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    if (!exhibitionImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    // 날짜 검증
    if (new Date(exhibitionForm.startDate) >= new Date(exhibitionForm.endDate)) {
      alert('종료일은 시작일보다 늦어야 합니다.');
      return;
    }

    try {
      setIsExhibitionLoading(true);
      
      // date 형식을 ISO 8601 형식으로 변환 (시작일: 00:00:00, 종료일: 23:59:59)
      const startDateTime = new Date(exhibitionForm.startDate + 'T00:00:00');
      const endDateTime = new Date(exhibitionForm.endDate + 'T23:59:59');
      
      const formData = {
        ...exhibitionForm,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
      };
      
      await exhibitionAPI.createExhibition(formData, exhibitionImage);
      
      // 목록 새로고침
      const updated = await exhibitionAPI.getAllExhibitions();
      setExhibitions(updated);
      
      alert('전시가 추가되었습니다.');
      handleCancelExhibitionForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '추가에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsExhibitionLoading(false);
    }
  };

  // 전시 수정
  const handleUpdateExhibition = async () => {
    if (!editingExhibition) return;
    
    if (!exhibitionForm.title || !exhibitionForm.artist || !exhibitionForm.location || 
        !exhibitionForm.description || !exhibitionForm.startDate || !exhibitionForm.endDate) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 날짜 검증
    if (new Date(exhibitionForm.startDate) >= new Date(exhibitionForm.endDate)) {
      alert('종료일은 시작일보다 늦어야 합니다.');
      return;
    }

    try {
      setIsExhibitionLoading(true);
      
      // date 형식을 ISO 8601 형식으로 변환 (시작일: 00:00:00, 종료일: 23:59:59)
      const startDateTime = new Date(exhibitionForm.startDate + 'T00:00:00');
      const endDateTime = new Date(exhibitionForm.endDate + 'T23:59:59');
      
      const formData = {
        ...exhibitionForm,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
      };
      
      await exhibitionAPI.updateExhibition(editingExhibition.id, formData, exhibitionImage || undefined);
      
      // 목록 새로고침
      const updated = await exhibitionAPI.getAllExhibitions();
      setExhibitions(updated);
      
      alert('전시가 수정되었습니다.');
      handleCancelExhibitionForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '수정에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsExhibitionLoading(false);
    }
  };

  // 전시 삭제
  const handleDeleteExhibition = async (id: number) => {
    if (!confirm('이 전시를 삭제하시겠습니까?')) return;

    try {
      setIsExhibitionLoading(true);
      await exhibitionAPI.deleteExhibition(id);
      
      // 목록 새로고침
      const updated = await exhibitionAPI.getAllExhibitions();
      setExhibitions(updated);
      
      alert('전시가 삭제되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsExhibitionLoading(false);
    }
  };

  // 공모전 이미지 선택 및 리사이징
  const handleContestImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 1200, 1600);
      setContestImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setContestImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  // 공모전 정보 저장
  const handleSaveContest = async () => {
    if (!contestData.title || !contestData.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsContestLoading(true);
      
      // 텍스트 데이터 저장
      await Promise.all([
        websiteAPI.updateTextSetting('contest_title', contestData.title),
        websiteAPI.updateTextSetting('contest_subtitle', contestData.subtitle),
        websiteAPI.updateTextSetting('contest_content', contestData.content),
        websiteAPI.updateTextSetting('contest_active', contestData.isActive ? 'true' : 'false'),
        websiteAPI.updateTextSetting('contest_intro_link', contestData.introLink),
        websiteAPI.updateTextSetting('contest_notice_link', contestData.noticeLink),
      ]);
      
      // 이미지가 있으면 업로드
      if (contestImage) {
        const response = await websiteAPI.uploadImage('contest_poster', contestImage);
        
        setContestData({
          ...contestData,
          imageUrl: response.imageUrl || contestData.imageUrl,
        });
        
        if (response.imageUrl) {
          const imageUrl = response.imageUrl.startsWith('http')
            ? response.imageUrl
            : `${import.meta.env.VITE_API_BASE_URL || ''}${response.imageUrl}`;
          setContestImagePreview(imageUrl);
        }
        
        setContestImage(null);
      }
      
      alert('공모전 정보가 업데이트되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업데이트에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsContestLoading(false);
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


            {/* 공모전 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">공모전 정보</h2>
              <p className="text-sm text-gray-600 mb-4">홈페이지에 표시되는 공모전 정보를 관리할 수 있습니다.</p>
              <div className="space-y-4">
                {/* 활성화 여부 */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="contestActive"
                    checked={contestData.isActive}
                    onChange={(e) => setContestData({ ...contestData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="contestActive" className="cursor-pointer">
                    홈페이지에 공모전 섹션 표시
                  </Label>
                </div>

                {/* 포스터 이미지 */}
                {contestImagePreview && (
                  <div>
                    <Label>현재 포스터 이미지</Label>
                    <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
                      <img 
                        src={contestImagePreview} 
                        alt="공모전 포스터 미리보기" 
                        className="w-full max-w-md h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="contestImage">포스터 이미지</Label>
                  <Input
                    id="contestImage"
                    type="file"
                    accept="image/*"
                    onChange={handleContestImageChange}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">권장 비율: 3:4 세로 포스터 (예: 900x1200px)</p>
                </div>

                {/* 제목 */}
                <div>
                  <Label htmlFor="contestTitle">큰 제목 *</Label>
                  <Input
                    id="contestTitle"
                    type="text"
                    value={contestData.title}
                    onChange={(e) => setContestData({ ...contestData, title: e.target.value })}
                    placeholder="예: 제44회 대한민국미술대전 <구상부문> 개최공고"
                    className="mt-1"
                  />
                </div>

                {/* 부제목 */}
                <div>
                  <Label htmlFor="contestSubtitle">작은 제목 (선택)</Label>
                  <Input
                    id="contestSubtitle"
                    type="text"
                    value={contestData.subtitle}
                    onChange={(e) => setContestData({ ...contestData, subtitle: e.target.value })}
                    placeholder="예: 대한민국미술대전 구상부문"
                    className="mt-1"
                  />
                </div>

                {/* 내용 */}
                <div>
                  <Label htmlFor="contestContent">내용 *</Label>
                  <Textarea
                    id="contestContent"
                    value={contestData.content}
                    onChange={(e) => setContestData({ ...contestData, content: e.target.value })}
                    placeholder="전시명: 제44회 대한민국미술대전...&#10;전시장소: 안성예술의전당 화랑전...&#10;전시기간: 2026년 1월 14일(수) ~..."
                    rows={6}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">각 항목을 줄바꿈으로 구분해주세요</p>
                </div>

                {/* 미술대전 소개 링크 */}
                <div>
                  <Label htmlFor="contestIntroLink">미술대전 소개 버튼 링크</Label>
                  <Input
                    id="contestIntroLink"
                    type="url"
                    value={contestData.introLink}
                    onChange={(e) => setContestData({ ...contestData, introLink: e.target.value })}
                    placeholder="https://example.com/intro"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">미술대전 소개 버튼 클릭 시 이동할 URL을 입력하세요</p>
                </div>

                {/* 공지사항 보기 링크 */}
                <div>
                  <Label htmlFor="contestNoticeLink">공지사항 보기 버튼 링크</Label>
                  <Input
                    id="contestNoticeLink"
                    type="url"
                    value={contestData.noticeLink}
                    onChange={(e) => setContestData({ ...contestData, noticeLink: e.target.value })}
                    placeholder="https://example.com/notice"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">공지사항 보기 버튼 클릭 시 이동할 URL을 입력하세요</p>
                </div>

                <Button
                  onClick={handleSaveContest}
                  disabled={isContestLoading}
                  className="bg-teal-700 hover:bg-teal-800 text-white w-full"
                >
                  {isContestLoading ? '저장 중...' : '공모전 정보 저장'}
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

            {/* 시설 규모 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">시설 규모 정보</h2>
              <p className="text-sm text-gray-600 mb-4">미술관 연혁 하단에 표시되는 시설 규모 정보를 관리할 수 있습니다.</p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="facilitySiteArea">전체 부지 면적 (㎡ 단위는 자동 추가)</Label>
                  <Input
                    id="facilitySiteArea"
                    type="text"
                    value={facilitySiteArea}
                    onChange={(e) => setFacilitySiteArea(e.target.value)}
                    placeholder="예: 3,500"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">숫자만 입력하세요 (단위 ㎡는 자동으로 표시됩니다)</p>
                </div>

                <div>
                  <Label htmlFor="facilityExhibitionRooms">전시실 및 특별실 ('개' 단위는 자동 추가)</Label>
                  <Input
                    id="facilityExhibitionRooms"
                    type="text"
                    value={facilityExhibitionRooms}
                    onChange={(e) => setFacilityExhibitionRooms(e.target.value)}
                    placeholder="예: 6"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">숫자만 입력하세요 (단위 '개'는 자동으로 표시됩니다)</p>
                </div>

                <div>
                  <Label htmlFor="facilityCollectionCount">소장품 수 ('점' 단위는 자동 추가)</Label>
                  <Input
                    id="facilityCollectionCount"
                    type="text"
                    value={facilityCollectionCount}
                    onChange={(e) => setFacilityCollectionCount(e.target.value)}
                    placeholder="예: 420"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">숫자만 입력하세요 (단위 '점'은 자동으로 표시됩니다)</p>
                </div>

                <Button
                  onClick={handleSaveFacility}
                  disabled={isFacilityLoading}
                  className="bg-teal-700 hover:bg-teal-800 text-white w-full"
                >
                  {isFacilityLoading ? '저장 중...' : '시설 규모 저장'}
                </Button>
              </div>
            </div>

            {/* 소장품 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">소장품 관리</h2>
                  <p className="text-sm text-gray-600 mt-1">대표 소장품 섹션에 표시될 작품들을 관리할 수 있습니다.</p>
                </div>
                <Button
                  onClick={handleOpenAddCollectionForm}
                  className="bg-teal-700 hover:bg-teal-800 text-white"
                  disabled={isCollectionLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  소장품 추가
                </Button>
              </div>

              {/* 소장품 목록 */}
              {collections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  등록된 소장품이 없습니다.
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-teal-500 transition-colors"
                    >
                      <div className="flex gap-4">
                        {/* 이미지 */}
                        <div className="flex-shrink-0">
                          <img
                            src={
                              collection.imageUrl.startsWith('http')
                                ? collection.imageUrl
                                : `${import.meta.env.VITE_API_BASE_URL || ''}${collection.imageUrl}`
                            }
                            alt={collection.title}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                        </div>

                        {/* 정보 */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{collection.title}</h3>
                          <div className="text-sm text-gray-600 space-y-1 mb-2">
                            <p>제작연도: {collection.year}</p>
                            <p>크기: {collection.size}</p>
                            <p>표시순서: {collection.displayOrder}</p>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{collection.description}</p>
                        </div>

                        {/* 버튼 */}
                        <div className="flex-shrink-0 flex flex-col gap-2">
                          <Button
                            onClick={() => handleOpenEditCollectionForm(collection)}
                            variant="outline"
                            size="sm"
                            disabled={isCollectionLoading}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            수정
                          </Button>
                          <Button
                            onClick={() => handleDeleteCollection(collection.id)}
                            variant="destructive"
                            size="sm"
                            disabled={isCollectionLoading}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 소장품 추가/수정 폼 */}
              {showCollectionForm && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingCollection ? '소장품 수정' : '새 소장품 추가'}
                  </h3>

                  <div className="space-y-4">
                    {/* 이미지 업로드 */}
                    <div>
                      <Label htmlFor="collectionImage">작품 이미지{!editingCollection && ' *'}</Label>
                      {collectionImagePreview && (
                        <div className="mt-2 mb-3 border border-gray-300 rounded-md overflow-hidden inline-block">
                          <img
                            src={collectionImagePreview}
                            alt="미리보기"
                            className="w-48 h-48 object-cover"
                          />
                        </div>
                      )}
                      <Input
                        id="collectionImage"
                        type="file"
                        accept="image/*"
                        onChange={handleCollectionImageChange}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {editingCollection 
                          ? '이미지를 변경하지 않으려면 선택하지 마세요.' 
                          : '권장 크기: 1200x1200px 이상'}
                      </p>
                    </div>

                    {/* 작품명 */}
                    <div>
                      <Label htmlFor="collectionTitle">작품명 *</Label>
                      <Input
                        id="collectionTitle"
                        type="text"
                        value={collectionForm.title}
                        onChange={(e) => setCollectionForm({ ...collectionForm, title: e.target.value })}
                        placeholder="예: 청송의 아침"
                        className="mt-1"
                      />
                    </div>

                    {/* 제작연도 */}
                    <div>
                      <Label htmlFor="collectionYear">제작연도 *</Label>
                      <Input
                        id="collectionYear"
                        type="text"
                        value={collectionForm.year}
                        onChange={(e) => setCollectionForm({ ...collectionForm, year: e.target.value })}
                        placeholder="예: 1985"
                        className="mt-1"
                      />
                    </div>

                    {/* 크기 */}
                    <div>
                      <Label htmlFor="collectionSize">크기 *</Label>
                      <Input
                        id="collectionSize"
                        type="text"
                        value={collectionForm.size}
                        onChange={(e) => setCollectionForm({ ...collectionForm, size: e.target.value })}
                        placeholder="예: 130 x 162 cm"
                        className="mt-1"
                      />
                    </div>

                    {/* 작품 설명 */}
                    <div>
                      <Label htmlFor="collectionDescription">작품 설명 *</Label>
                      <Textarea
                        id="collectionDescription"
                        value={collectionForm.description}
                        onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                        placeholder="작품에 대한 설명을 입력하세요"
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    {/* 표시순서 */}
                    <div>
                      <Label htmlFor="collectionDisplayOrder">표시순서 *</Label>
                      <Input
                        id="collectionDisplayOrder"
                        type="number"
                        value={collectionForm.displayOrder}
                        onChange={(e) => setCollectionForm({ ...collectionForm, displayOrder: parseInt(e.target.value) || 0 })}
                        placeholder="1"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">낮은 숫자가 먼저 표시됩니다</p>
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={editingCollection ? handleUpdateCollection : handleCreateCollection}
                        disabled={isCollectionLoading}
                        className="bg-teal-700 hover:bg-teal-800 text-white flex-1"
                      >
                        {isCollectionLoading ? '처리 중...' : (editingCollection ? '수정 완료' : '추가 완료')}
                      </Button>
                      <Button
                        onClick={handleCancelCollectionForm}
                        variant="outline"
                        disabled={isCollectionLoading}
                        className="flex-1"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
