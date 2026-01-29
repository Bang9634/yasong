import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { useAuth } from '@/context/AuthContext';
import { websiteAPI, collectionAPI } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';

// 섹션 컴포넌트 import
import { HeroImageManagement } from './sections/HeroImageManagement';
import { ContestManagement } from './sections/ContestManagement';
import { DirectorManagement } from './sections/DirectorManagement';
import { BuildingManagement } from './sections/BuildingManagement';
import { HistoryManagement } from './sections/HistoryManagement';
import { FacilityManagement } from './sections/FacilityManagement';
import { CollectionManagement } from './sections/CollectionManagement';
import { VisitInfoManagement } from './sections/VisitInfoManagement';
import { LocationManagement } from './sections/LocationManagement';
import { FooterManagement } from './sections/FooterManagement';

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

export function WebsiteManagement() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // 초기 데이터 상태
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [contestData, setContestData] = useState({
    title: '',
    subtitle: '',
    content: '',
    imageUrl: '',
    isActive: true,
    introLink: '',
    noticeLink: '',
  });
  const [directorData, setDirectorData] = useState({
    name: '',
    bio: '',
    philosophy: '',
    quote: '',
    collection: '',
  });
  const [directorImageUrl, setDirectorImageUrl] = useState('');
  const [mainBuildingImageUrl, setMainBuildingImageUrl] = useState('');
  const [mainBuildingText, setMainBuildingText] = useState('');
  const [cheongryangImageUrl, setCheongryangImageUrl] = useState('');
  const [cheongryangText, setCheongryangText] = useState('');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [facilitySiteArea, setFacilitySiteArea] = useState('');
  const [facilityExhibitionRooms, setFacilityExhibitionRooms] = useState('');
  const [facilityCollectionCount, setFacilityCollectionCount] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [visitInfo, setVisitInfo] = useState({
    operatingHours: '',
    admissionFee: '',
    etiquette: '',
    phone: '',
    email: '',
  });
  const [locationData, setLocationData] = useState({
    address: '',
    postalCode: '',
    carInfo: '',
    busInfo: '',
    trainInfo: '',
    parkingInfo: '',
    latitude: '',
    longitude: '',
  });
  const [footerData, setFooterData] = useState({
    description: '',
    phone: '',
    phoneHours: '',
    email: '',
    address: '',
    operatingHours: '',
    closedDay: '',
    bottomInfo: '',
    copyright: '',
    facebookUrl: '',
    facebookEnabled: false,
    instagramUrl: '',
    instagramEnabled: false,
    youtubeUrl: '',
    youtubeEnabled: false,
    kakaoUrl: '',
    kakaoEnabled: false,
    privacyPolicyUrl: '',
    privacyPolicyEnabled: false,
    termsUrl: '',
    termsEnabled: false,
    locationLinkUrl: '',
    locationLinkEnabled: false,
    recruitUrl: '',
    recruitEnabled: false,
  });

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
          setHeroImageUrl(imageUrl);
        }

        // 초대관장 프로필 이미지 조회
        const directorImageData = await websiteAPI.getImage('director');
        if (directorImageData.imageUrl) {
          const imageUrl = directorImageData.imageUrl.startsWith('http') 
            ? directorImageData.imageUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${directorImageData.imageUrl}`;
          setDirectorImageUrl(imageUrl);
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
          setMainBuildingImageUrl(imageUrl);
        }
        const mainBuildingTextData = await websiteAPI.getTextSetting('main_building_description');
        setMainBuildingText(mainBuildingTextData.value || '');

        // 청량대운도전시관 정보 조회
        const cheongryangImageData = await websiteAPI.getImage('cheongryangdae_building');
        if (cheongryangImageData.imageUrl) {
          const imageUrl = cheongryangImageData.imageUrl.startsWith('http') 
            ? cheongryangImageData.imageUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${cheongryangImageData.imageUrl}`;
          setCheongryangImageUrl(imageUrl);
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
        
        let contestImageUrl = '';
        if (contestImageData.imageUrl) {
          contestImageUrl = contestImageData.imageUrl.startsWith('http')
            ? contestImageData.imageUrl
            : `${import.meta.env.VITE_API_BASE_URL || ''}${contestImageData.imageUrl}`;
        }

        setContestData({
          title: contestTitleData.value || '',
          subtitle: contestSubtitleData.value || '',
          content: contestContentData.value || '',
          imageUrl: contestImageUrl,
          isActive: contestActiveData.value === 'true',
          introLink: contestIntroLinkData.value || '',
          noticeLink: contestNoticeLinkData.value || '',
        });

        // 관람 안내 조회
        const [visitHoursData, visitFeeData, visitEtiquetteData, visitPhoneData, visitEmailData] = await Promise.all([
          websiteAPI.getTextSetting('visit_operating_hours'),
          websiteAPI.getTextSetting('visit_admission_fee'),
          websiteAPI.getTextSetting('visit_etiquette'),
          websiteAPI.getTextSetting('visit_phone'),
          websiteAPI.getTextSetting('visit_email'),
        ]);

        setVisitInfo({
          operatingHours: visitHoursData.value || '',
          admissionFee: visitFeeData.value || '',
          etiquette: visitEtiquetteData.value || '',
          phone: visitPhoneData.value || '',
          email: visitEmailData.value || '',
        });

        // 오시는 길 조회
        const [addressData, postalCodeData, carInfoData, busInfoData, trainInfoData, parkingInfoData, latitudeData, longitudeData] = await Promise.all([
          websiteAPI.getTextSetting('location_address'),
          websiteAPI.getTextSetting('location_postal_code'),
          websiteAPI.getTextSetting('location_car_info'),
          websiteAPI.getTextSetting('location_bus_info'),
          websiteAPI.getTextSetting('location_train_info'),
          websiteAPI.getTextSetting('location_parking_info'),
          websiteAPI.getTextSetting('location_latitude'),
          websiteAPI.getTextSetting('location_longitude'),
        ]);

        setLocationData({
          address: addressData.value || '',
          postalCode: postalCodeData.value || '',
          carInfo: carInfoData.value || '',
          busInfo: busInfoData.value || '',
          trainInfo: trainInfoData.value || '',
          parkingInfo: parkingInfoData.value || '',
          latitude: latitudeData.value || '36.4347',
          longitude: longitudeData.value || '129.0542',
        });

        // 푸터 정보 조회
        const [
          footerDescData,
          footerPhoneData,
          footerPhoneHoursData,
          footerEmailData,
          footerAddressData,
          footerOperatingHoursData,
          footerClosedDayData,
          footerBottomInfoData,
          footerCopyrightData,
          footerFacebookUrlData,
          footerFacebookEnabledData,
          footerInstagramUrlData,
          footerInstagramEnabledData,
          footerYoutubeUrlData,
          footerYoutubeEnabledData,
          footerKakaoUrlData,
          footerKakaoEnabledData,
          footerPrivacyPolicyUrlData,
          footerPrivacyPolicyEnabledData,
          footerTermsUrlData,
          footerTermsEnabledData,
          footerLocationLinkUrlData,
          footerLocationLinkEnabledData,
          footerRecruitUrlData,
          footerRecruitEnabledData,
        ] = await Promise.all([
          websiteAPI.getTextSetting('footer_description'),
          websiteAPI.getTextSetting('footer_phone'),
          websiteAPI.getTextSetting('footer_phone_hours'),
          websiteAPI.getTextSetting('footer_email'),
          websiteAPI.getTextSetting('footer_address'),
          websiteAPI.getTextSetting('footer_operating_hours'),
          websiteAPI.getTextSetting('footer_closed_day'),
          websiteAPI.getTextSetting('footer_bottom_info'),
          websiteAPI.getTextSetting('footer_copyright'),
          websiteAPI.getTextSetting('footer_facebook_url'),
          websiteAPI.getTextSetting('footer_facebook_enabled'),
          websiteAPI.getTextSetting('footer_instagram_url'),
          websiteAPI.getTextSetting('footer_instagram_enabled'),
          websiteAPI.getTextSetting('footer_youtube_url'),
          websiteAPI.getTextSetting('footer_youtube_enabled'),
          websiteAPI.getTextSetting('footer_kakao_url'),
          websiteAPI.getTextSetting('footer_kakao_enabled'),
          websiteAPI.getTextSetting('footer_privacy_policy_url'),
          websiteAPI.getTextSetting('footer_privacy_policy_enabled'),
          websiteAPI.getTextSetting('footer_terms_url'),
          websiteAPI.getTextSetting('footer_terms_enabled'),
          websiteAPI.getTextSetting('footer_location_link_url'),
          websiteAPI.getTextSetting('footer_location_link_enabled'),
          websiteAPI.getTextSetting('footer_recruit_url'),
          websiteAPI.getTextSetting('footer_recruit_enabled'),
        ]);

        setFooterData({
          description: footerDescData.value || '',
          phone: footerPhoneData.value || '',
          phoneHours: footerPhoneHoursData.value || '',
          email: footerEmailData.value || '',
          address: footerAddressData.value || '',
          operatingHours: footerOperatingHoursData.value || '',
          closedDay: footerClosedDayData.value || '',
          bottomInfo: footerBottomInfoData.value || '',
          copyright: footerCopyrightData.value || '',
          facebookUrl: footerFacebookUrlData.value || '',
          facebookEnabled: footerFacebookEnabledData.value === 'true',
          instagramUrl: footerInstagramUrlData.value || '',
          instagramEnabled: footerInstagramEnabledData.value === 'true',
          youtubeUrl: footerYoutubeUrlData.value || '',
          youtubeEnabled: footerYoutubeEnabledData.value === 'true',
          kakaoUrl: footerKakaoUrlData.value || '',
          kakaoEnabled: footerKakaoEnabledData.value === 'true',
          privacyPolicyUrl: footerPrivacyPolicyUrlData.value || '',
          privacyPolicyEnabled: footerPrivacyPolicyEnabledData.value === 'true',
          termsUrl: footerTermsUrlData.value || '',
          termsEnabled: footerTermsEnabledData.value === 'true',
          locationLinkUrl: footerLocationLinkUrlData.value || '',
          locationLinkEnabled: footerLocationLinkEnabledData.value === 'true',
          recruitUrl: footerRecruitUrlData.value || '',
          recruitEnabled: footerRecruitEnabledData.value === 'true',
        });

      } catch (err) {
        console.error('데이터 로드 실패:', err);
      }
    };

    fetchData();
  }, [user]);

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
            <HeroImageManagement initialImageUrl={heroImageUrl} />

            {/* 공모전 관리 */}
            <ContestManagement initialData={contestData} />
            
            {/* 초대관장 관리 */}
            <DirectorManagement initialData={directorData} initialImageUrl={directorImageUrl} />

            {/* 건물 관리 (본관 + 청량대운도전시관) */}
            <BuildingManagement
              mainBuildingImageUrl={mainBuildingImageUrl}
              mainBuildingText={mainBuildingText}
              cheongryangImageUrl={cheongryangImageUrl}
              cheongryangText={cheongryangText}
            />

            {/* 미술관 연혁 관리 */}
            <HistoryManagement initialItems={historyItems} />

            {/* 시설 규모 관리 */}
            <FacilityManagement
              siteArea={facilitySiteArea}
              exhibitionRooms={facilityExhibitionRooms}
              collectionCount={facilityCollectionCount}
            />

            {/* 관람 안내 관리 */}
            <VisitInfoManagement initialData={visitInfo} />

            {/* 오시는 길 관리 */}
            <LocationManagement initialData={locationData} />

            {/* 푸터 관리 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-teal-900 mb-4">푸터 관리</h2>
              <FooterManagement initialData={footerData} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
