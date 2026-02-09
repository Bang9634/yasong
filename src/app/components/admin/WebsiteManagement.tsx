import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { useAuth } from '@/context/AuthContext';
import { websiteAPI, collectionAPI } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';

// 섹션 컴포넌트 import
import { FooterManagement } from './sections/FooterManagement';


export function WebsiteManagement() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'footer'>('footer');
  
  // 초기 데이터 상태
  const [footerData, setFooterData] = useState({
    phone: '',
    email: '',
    facebookUrl: '',
    facebookEnabled: false,
    instagramUrl: '',
    instagramEnabled: false,
    youtubeUrl: '',
    youtubeEnabled: false,
    kakaoUrl: '',
    kakaoEnabled: false,
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
        // 푸터 정보 조회
        const [
          footerPhoneData,
          footerEmailData,
          footerFacebookUrlData,
          footerFacebookEnabledData,
          footerInstagramUrlData,
          footerInstagramEnabledData,
          footerYoutubeUrlData,
          footerYoutubeEnabledData,
          footerKakaoUrlData,
          footerKakaoEnabledData,
        ] = await Promise.all([
          websiteAPI.getTextSetting('footer_phone'),
          websiteAPI.getTextSetting('footer_email'),
          websiteAPI.getTextSetting('footer_facebook_url'),
          websiteAPI.getTextSetting('footer_facebook_enabled'),
          websiteAPI.getTextSetting('footer_instagram_url'),
          websiteAPI.getTextSetting('footer_instagram_enabled'),
          websiteAPI.getTextSetting('footer_youtube_url'),
          websiteAPI.getTextSetting('footer_youtube_enabled'),
          websiteAPI.getTextSetting('footer_kakao_url'),
          websiteAPI.getTextSetting('footer_kakao_enabled'),
        ]);

        setFooterData({
          phone: footerPhoneData.value || '',
          email: footerEmailData.value || '',
          facebookUrl: footerFacebookUrlData.value || '',
          facebookEnabled: footerFacebookEnabledData.value === 'true',
          instagramUrl: footerInstagramUrlData.value || '',
          instagramEnabled: footerInstagramEnabledData.value === 'true',
          youtubeUrl: footerYoutubeUrlData.value || '',
          youtubeEnabled: footerYoutubeEnabledData.value === 'true',
          kakaoUrl: footerKakaoUrlData.value || '',
          kakaoEnabled: footerKakaoEnabledData.value === 'true',
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
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      
      <div className="pt-24 pb-12 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2C2C2C] mb-2">홈페이지 관리</h1>
            <p className="text-[#2C2C2C]/70">웹사이트의 각 섹션을 탭별로 관리할 수 있습니다.</p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mb-6 border-b border-[#2C2C2C]/20">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('footer')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'footer'
                    ? 'border-[#C84630] text-[#C84630]'
                    : 'border-transparent text-[#2C2C2C]/60 hover:text-[#2C2C2C] hover:border-[#2C2C2C]/30'
                }`}
              >
                푸터
              </button>
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="space-y-6">
            {/* 푸터 탭 */}
            {activeTab === 'footer' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-[#2C2C2C] mb-4">푸터 관리</h2>
                <FooterManagement initialData={footerData} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
