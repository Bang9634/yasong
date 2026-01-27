import { useState, useEffect } from 'react';
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
  privacyPolicyUrl: string;
  privacyPolicyEnabled: boolean;
  termsUrl: string;
  termsEnabled: boolean;
  locationLinkUrl: string;
  locationLinkEnabled: boolean;
  recruitUrl: string;
  recruitEnabled: boolean;
}

interface FooterManagementProps {
  initialData: FooterData;
}

export function FooterManagement({ initialData }: FooterManagementProps) {
  const [description, setDescription] = useState(initialData.description);
  const [phone, setPhone] = useState(initialData.phone);
  const [phoneHours, setPhoneHours] = useState(initialData.phoneHours);
  const [email, setEmail] = useState(initialData.email);
  const [address, setAddress] = useState(initialData.address);
  const [operatingHours, setOperatingHours] = useState(initialData.operatingHours);
  const [closedDay, setClosedDay] = useState(initialData.closedDay);
  const [bottomInfo, setBottomInfo] = useState(initialData.bottomInfo);
  const [copyright, setCopyright] = useState(initialData.copyright);
  const [facebookUrl, setFacebookUrl] = useState(initialData.facebookUrl);
  const [facebookEnabled, setFacebookEnabled] = useState(initialData.facebookEnabled);
  const [instagramUrl, setInstagramUrl] = useState(initialData.instagramUrl);
  const [instagramEnabled, setInstagramEnabled] = useState(initialData.instagramEnabled);
  const [youtubeUrl, setYoutubeUrl] = useState(initialData.youtubeUrl);
  const [youtubeEnabled, setYoutubeEnabled] = useState(initialData.youtubeEnabled);
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState(initialData.privacyPolicyUrl);
  const [privacyPolicyEnabled, setPrivacyPolicyEnabled] = useState(initialData.privacyPolicyEnabled);
  const [termsUrl, setTermsUrl] = useState(initialData.termsUrl);
  const [termsEnabled, setTermsEnabled] = useState(initialData.termsEnabled);
  const [locationLinkUrl, setLocationLinkUrl] = useState(initialData.locationLinkUrl);
  const [locationLinkEnabled, setLocationLinkEnabled] = useState(initialData.locationLinkEnabled);
  const [recruitUrl, setRecruitUrl] = useState(initialData.recruitUrl);
  const [recruitEnabled, setRecruitEnabled] = useState(initialData.recruitEnabled);

  useEffect(() => {
    setDescription(initialData.description);
    setPhone(initialData.phone);
    setPhoneHours(initialData.phoneHours);
    setEmail(initialData.email);
    setAddress(initialData.address);
    setOperatingHours(initialData.operatingHours);
    setClosedDay(initialData.closedDay);
    setBottomInfo(initialData.bottomInfo);
    setCopyright(initialData.copyright);
    setFacebookUrl(initialData.facebookUrl);
    setFacebookEnabled(initialData.facebookEnabled);
    setInstagramUrl(initialData.instagramUrl);
    setInstagramEnabled(initialData.instagramEnabled);
    setYoutubeUrl(initialData.youtubeUrl);
    setYoutubeEnabled(initialData.youtubeEnabled);
    setPrivacyPolicyUrl(initialData.privacyPolicyUrl);
    setPrivacyPolicyEnabled(initialData.privacyPolicyEnabled);
    setTermsUrl(initialData.termsUrl);
    setTermsEnabled(initialData.termsEnabled);
    setLocationLinkUrl(initialData.locationLinkUrl);
    setLocationLinkEnabled(initialData.locationLinkEnabled);
    setRecruitUrl(initialData.recruitUrl);
    setRecruitEnabled(initialData.recruitEnabled);
  }, [initialData]);

  const handleSave = async () => {
    try {
      const promises = [
        websiteAPI.updateTextSetting('footer_description', description),
        websiteAPI.updateTextSetting('footer_phone', phone),
        websiteAPI.updateTextSetting('footer_phone_hours', phoneHours),
        websiteAPI.updateTextSetting('footer_email', email),
        websiteAPI.updateTextSetting('footer_address', address),
        websiteAPI.updateTextSetting('footer_operating_hours', operatingHours),
        websiteAPI.updateTextSetting('footer_closed_day', closedDay),
        websiteAPI.updateTextSetting('footer_bottom_info', bottomInfo),
        websiteAPI.updateTextSetting('footer_copyright', copyright),
      ];

      // 소셜미디어 링크는 값이 있을 때만 저장
      if (facebookUrl || facebookEnabled) {
        promises.push(websiteAPI.updateTextSetting('footer_facebook_url', facebookUrl || '-'));
        promises.push(websiteAPI.updateTextSetting('footer_facebook_enabled', facebookEnabled ? 'true' : 'false'));
      }
      if (instagramUrl || instagramEnabled) {
        promises.push(websiteAPI.updateTextSetting('footer_instagram_url', instagramUrl || '-'));
        promises.push(websiteAPI.updateTextSetting('footer_instagram_enabled', instagramEnabled ? 'true' : 'false'));
      }
      if (youtubeUrl || youtubeEnabled) {
        promises.push(websiteAPI.updateTextSetting('footer_youtube_url', youtubeUrl || '-'));
        promises.push(websiteAPI.updateTextSetting('footer_youtube_enabled', youtubeEnabled ? 'true' : 'false'));
      }
      if (privacyPolicyUrl || privacyPolicyEnabled) {
        promises.push(websiteAPI.updateTextSetting('footer_privacy_policy_url', privacyPolicyUrl || '-'));
        promises.push(websiteAPI.updateTextSetting('footer_privacy_policy_enabled', privacyPolicyEnabled ? 'true' : 'false'));
      }
      if (termsUrl || termsEnabled) {
        promises.push(websiteAPI.updateTextSetting('footer_terms_url', termsUrl || '-'));
        promises.push(websiteAPI.updateTextSetting('footer_terms_enabled', termsEnabled ? 'true' : 'false'));
      }
      if (locationLinkUrl || locationLinkEnabled) {
        promises.push(websiteAPI.updateTextSetting('footer_location_link_url', locationLinkUrl || '-'));
        promises.push(websiteAPI.updateTextSetting('footer_location_link_enabled', locationLinkEnabled ? 'true' : 'false'));
      }
      if (recruitUrl || recruitEnabled) {
        promises.push(websiteAPI.updateTextSetting('footer_recruit_url', recruitUrl || '-'));
        promises.push(websiteAPI.updateTextSetting('footer_recruit_enabled', recruitEnabled ? 'true' : 'false'));
      }

      await Promise.all(promises);
      
      alert('푸터 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('Failed to update footer:', error);
      alert('업데이트에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          미술관 설명
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          rows={3}
          placeholder="이원좌 화백의 예술 정신을 계승하고
지역 문화예술 발전에 기여하는
청송의 문화 중심지"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전화번호
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="054-870-6000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전화 이용 시간
          </label>
          <input
            type="text"
            value={phoneHours}
            onChange={(e) => setPhoneHours(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="평일 10:00-17:00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이메일
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="info@yasong-museum.kr"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          주소
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          rows={2}
          placeholder="경상북도 청송군
청송읍 월막길 123"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          운영 시간 (줄바꿈으로 구분)
        </label>
        <textarea
          value={operatingHours}
          onChange={(e) => setOperatingHours(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          rows={3}
          placeholder="화-금: 10:00 - 18:00
토-일: 10:00 - 19:00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          휴관일
        </label>
        <input
          type="text"
          value={closedDay}
          onChange={(e) => setClosedDay(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="휴관: 매주 월요일"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          하단 정보
        </label>
        <input
          type="text"
          value={bottomInfo}
          onChange={(e) => setBottomInfo(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="군립청송야송미술관 | 관장: 김문희 | 사업자등록번호: 123-45-67890"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          저작권 정보
        </label>
        <input
          type="text"
          value={copyright}
          onChange={(e) => setCopyright(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Copyright © 2026 Cheongsung Yasong Art Museum. All rights reserved."
        />
      </div>

      {/* 소셜미디어 링크 섹션 */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">소셜미디어 링크 (선택사항)</h3>
        
        {/* 페이스북 */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={facebookEnabled}
              onChange={(e) => setFacebookEnabled(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              페이스북 버튼 표시
            </label>
          </div>
          <input
            type="url"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://facebook.com/yasong-museum (선택사항)"
            disabled={!facebookEnabled}
          />
        </div>

        {/* 인스타그램 */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={instagramEnabled}
              onChange={(e) => setInstagramEnabled(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              인스타그램 버튼 표시
            </label>
          </div>
          <input
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://instagram.com/yasong_museum (선택사항)"
            disabled={!instagramEnabled}
          />
        </div>

        {/* 유튜브 */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={youtubeEnabled}
              onChange={(e) => setYoutubeEnabled(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              유튜브 버튼 표시
            </label>
          </div>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://youtube.com/@yasong-museum (선택사항)"
            disabled={!youtubeEnabled}
          />
        </div>
      </div>

      {/* 하단 링크 섹션 */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">하단 링크 (선택사항)</h3>
        
        {/* 개인정보처리방침 */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={privacyPolicyEnabled}
              onChange={(e) => setPrivacyPolicyEnabled(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              개인정보처리방침 링크 표시
            </label>
          </div>
          <input
            type="url"
            value={privacyPolicyUrl}
            onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://yasong-museum.kr/privacy (선택사항)"
            disabled={!privacyPolicyEnabled}
          />
        </div>

        {/* 이용약관 */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={termsEnabled}
              onChange={(e) => setTermsEnabled(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              이용약관 링크 표시
            </label>
          </div>
          <input
            type="url"
            value={termsUrl}
            onChange={(e) => setTermsUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://yasong-museum.kr/terms (선택사항)"
            disabled={!termsEnabled}
          />
        </div>

        {/* 찾아오시는 길 */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={locationLinkEnabled}
              onChange={(e) => setLocationLinkEnabled(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              찾아오시는 길 링크 표시
            </label>
          </div>
          <input
            type="url"
            value={locationLinkUrl}
            onChange={(e) => setLocationLinkUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://yasong-museum.kr/location (선택사항)"
            disabled={!locationLinkEnabled}
          />
        </div>

        {/* 채용정보 */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={recruitEnabled}
              onChange={(e) => setRecruitEnabled(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              채용정보 링크 표시
            </label>
          </div>
          <input
            type="url"
            value={recruitUrl}
            onChange={(e) => setRecruitUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://yasong-museum.kr/recruit (선택사항)"
            disabled={!recruitEnabled}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors"
      >
        저장
      </button>
    </div>
  );
}
