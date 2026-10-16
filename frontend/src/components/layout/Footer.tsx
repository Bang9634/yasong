import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { websiteAPI } from '@/utils/api';

interface FooterData {
  description: string;
  phone: string;
  phoneHours: string;
  email: string;
  address: string;
  operatingHours: string;
  closedDay: string;
  bottomInfo: string;
  copyright: string;
  facebookUrl: string;
  facebookEnabled: boolean;
  instagramUrl: string;
  instagramEnabled: boolean;
  youtubeUrl: string;
  youtubeEnabled: boolean;
  kakaoUrl: string;
  kakaoEnabled: boolean;
  privacyPolicyUrl: string;
  privacyPolicyEnabled: boolean;
  termsUrl: string;
  termsEnabled: boolean;
  locationLinkUrl: string;
  locationLinkEnabled: boolean;
  recruitUrl: string;
  recruitEnabled: boolean;
}

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData>({
    description: '이원좌 화백의 예술 정신을 계승하고\n지역 문화예술 발전에 기여하는\n청송의 문화 중심지',
    phone: '',
    phoneHours: '',
    email: '',
    address: '경상북도 청송군',
    operatingHours: '',
    closedDay: '',
    bottomInfo: '',
    copyright: 'Copyright © 2026 Cheongsong Yasong Art Gallery. All rights reserved.',
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

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      const [
        descData,
        phoneData,
        phoneHoursData,
        emailData,
        addressData,
        operatingHoursData,
        closedDayData,
        bottomInfoData,
        copyrightData,
        facebookUrlData,
        facebookEnabledData,
        instagramUrlData,
        instagramEnabledData,
        youtubeUrlData,
        youtubeEnabledData,
        kakaoUrlData,
        kakaoEnabledData,
        privacyPolicyUrlData,
        privacyPolicyEnabledData,
        termsUrlData,
        termsEnabledData,
        locationLinkUrlData,
        locationLinkEnabledData,
        recruitUrlData,
        recruitEnabledData,
      ] = await Promise.all([
        websiteAPI.getTextSetting('footer_description').catch(() => ({ value: footerData.description })),
        websiteAPI.getTextSetting('footer_phone').catch(() => ({ value: footerData.phone })),
        websiteAPI.getTextSetting('footer_phone_hours').catch(() => ({ value: footerData.phoneHours })),
        websiteAPI.getTextSetting('footer_email').catch(() => ({ value: footerData.email })),
        websiteAPI.getTextSetting('footer_address').catch(() => ({ value: footerData.address })),
        websiteAPI.getTextSetting('footer_operating_hours').catch(() => ({ value: footerData.operatingHours })),
        websiteAPI.getTextSetting('footer_closed_day').catch(() => ({ value: footerData.closedDay })),
        websiteAPI.getTextSetting('footer_bottom_info').catch(() => ({ value: footerData.bottomInfo })),
        websiteAPI.getTextSetting('footer_copyright').catch(() => ({ value: footerData.copyright })),
        websiteAPI.getTextSetting('footer_facebook_url').catch(() => ({ value: '' })),
        websiteAPI.getTextSetting('footer_facebook_enabled').catch(() => ({ value: 'false' })),
        websiteAPI.getTextSetting('footer_instagram_url').catch(() => ({ value: '' })),
        websiteAPI.getTextSetting('footer_instagram_enabled').catch(() => ({ value: 'false' })),
        websiteAPI.getTextSetting('footer_youtube_url').catch(() => ({ value: '' })),
        websiteAPI.getTextSetting('footer_youtube_enabled').catch(() => ({ value: 'false' })),
        websiteAPI.getTextSetting('footer_kakao_url').catch(() => ({ value: '' })),
        websiteAPI.getTextSetting('footer_kakao_enabled').catch(() => ({ value: 'false' })),
        websiteAPI.getTextSetting('footer_privacy_policy_url').catch(() => ({ value: '' })),
        websiteAPI.getTextSetting('footer_privacy_policy_enabled').catch(() => ({ value: 'false' })),
        websiteAPI.getTextSetting('footer_terms_url').catch(() => ({ value: '' })),
        websiteAPI.getTextSetting('footer_terms_enabled').catch(() => ({ value: 'false' })),
        websiteAPI.getTextSetting('footer_location_link_url').catch(() => ({ value: '' })),
        websiteAPI.getTextSetting('footer_location_link_enabled').catch(() => ({ value: 'false' })),
        websiteAPI.getTextSetting('footer_recruit_url').catch(() => ({ value: '' })),
        websiteAPI.getTextSetting('footer_recruit_enabled').catch(() => ({ value: 'false' })),
      ]);

      setFooterData({
        description: descData.value || footerData.description,
        phone: phoneData.value || footerData.phone,
        phoneHours: phoneHoursData.value || footerData.phoneHours,
        email: emailData.value || footerData.email,
        address: addressData.value || footerData.address,
        operatingHours: operatingHoursData.value || footerData.operatingHours,
        closedDay: closedDayData.value || footerData.closedDay,
        bottomInfo: bottomInfoData.value || footerData.bottomInfo,
        copyright: copyrightData.value || footerData.copyright,
        facebookUrl: facebookUrlData.value || '',
        facebookEnabled: facebookEnabledData.value === 'true',
        instagramUrl: instagramUrlData.value || '',
        instagramEnabled: instagramEnabledData.value === 'true',
        youtubeUrl: youtubeUrlData.value || '',
        youtubeEnabled: youtubeEnabledData.value === 'true',
        kakaoUrl: kakaoUrlData.value || '',
        kakaoEnabled: kakaoEnabledData.value === 'true',
        privacyPolicyUrl: privacyPolicyUrlData.value || '',
        privacyPolicyEnabled: privacyPolicyEnabledData.value === 'true',
        termsUrl: termsUrlData.value || '',
        termsEnabled: termsEnabledData.value === 'true',
        locationLinkUrl: locationLinkUrlData.value || '',
        locationLinkEnabled: locationLinkEnabledData.value === 'true',
        recruitUrl: recruitUrlData.value || '',
        recruitEnabled: recruitEnabledData.value === 'true',
      });
    } catch (error) {
      console.error('Failed to load footer data:', error);
      // 에러 발생 시 기본값 유지
    }
  };

  const parseLines = (text: string): string[] => {
    return text.split('\n').filter(line => line.trim());
  };
  return (
    <footer className="bg-[#F4F4F0] text-[#2C2C2C]">
      {/* 최상단 구분선 */}
      <div className="w-full h-px bg-[#2C2C2C]/20"></div>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 중간 영역: 회사 정보 + Follow us */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          {/* 로고 + 네비게이션 + 회사 정보 그룹 */}
          <div className="flex flex-col items-start gap-2">
            {/* 로고 + 네비게이션 */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <Link to="/" className="text-3xl md:text-4xl font-bold text-[#2C2C2C] tracking-tight">
                YASONG
              </Link>
              {/* 네비게이션 링크 */}
              <nav className="flex flex-wrap gap-4 text-sm font-bold">
                {/* 이용약관 - 항상 표시 */}
                <Link
                  to="/legal/terms"
                  className="text-[#2C2C2C]/70 hover:text-[#C84630] transition-colors"
                >
                  이용약관
                </Link>
                {/* 개인정보 처리방침 - 항상 표시 */}
                <Link
                  to="/legal/privacy"
                  className="text-[#2C2C2C]/70 hover:text-[#C84630] transition-colors"
                >
                  개인정보처리방침
                </Link>
                {/* 업데이트 내역 - 항상 표시 */}
                <Link
                  to="/updates"
                  className="text-[#2C2C2C]/70 hover:text-[#C84630] transition-colors"
                >
                  업데이트 내역
                </Link>
                {footerData.locationLinkEnabled && footerData.locationLinkUrl && (
                  <a
                    href={footerData.locationLinkUrl}
                    className="text-[#2C2C2C]/70 hover:text-[#C84630] transition-colors"
                  >
                    FAQ
                  </a>
                )}
                {footerData.recruitEnabled && footerData.recruitUrl && (
                  <a
                    href={footerData.recruitUrl}
                    className="text-[#2C2C2C]/70 hover:text-[#C84630] transition-colors"
                  >
                    문의하기
                  </a>
                )}
              </nav>
            </div>
            {/* 회사 정보 */}
            <div className="text-xs text-[#2C2C2C]/60 leading-relaxed">
              {footerData.phone && <p>운영자 : 이은도 | 전화번호 : {footerData.phone} | 이메일 문의 : {footerData.email}</p>}
            </div>
          </div>

          {/* Follow us */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-[#2C2C2C]">Follow us</p>
            <div className="flex gap-3">
              {footerData.instagramEnabled && footerData.instagramUrl && (
                <a
                  href={footerData.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#C84630] hover:bg-[#2C2C2C] flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              )}
              {footerData.youtubeEnabled && footerData.youtubeUrl && (
                <a
                  href={footerData.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#C84630] hover:bg-[#2C2C2C] flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              )}
              {footerData.facebookEnabled && footerData.facebookUrl && (
                <a
                  href={footerData.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#C84630] hover:bg-[#2C2C2C] flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
              )}
              {footerData.kakaoEnabled && footerData.kakaoUrl && (
                <a
                  href={footerData.kakaoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#C84630] hover:bg-[#2C2C2C] flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </a>
              )}
            </div>
          </div>
        </div>
        {/* 하단 영역: 저작권 + 관리자 링크 */}
        <div className="pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-xs text-[#2C2C2C]/50">
              Copyright © 2026 Yasong. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/Bang9634" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-[#2C2C2C]/40 hover:text-[#C84630] transition-colors"
              >
                Designed & Developed by Deok-jae Bang
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
