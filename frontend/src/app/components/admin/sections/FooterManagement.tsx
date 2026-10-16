import { useState, useEffect } from 'react';
import { websiteAPI } from '@/utils/api';

interface FooterData {
  phone: string;
  email: string;
  facebookUrl: string;
  facebookEnabled: boolean;
  instagramUrl: string;
  instagramEnabled: boolean;
  youtubeUrl: string;
  youtubeEnabled: boolean;
  kakaoUrl: string;
  kakaoEnabled: boolean;
}

interface FooterManagementProps {
  initialData: FooterData;
}

export function FooterManagement({ initialData }: FooterManagementProps) {
  const [phone, setPhone] = useState(initialData.phone);
  const [email, setEmail] = useState(initialData.email);
  const [facebookUrl, setFacebookUrl] = useState(initialData.facebookUrl);
  const [facebookEnabled, setFacebookEnabled] = useState(initialData.facebookEnabled);
  const [instagramUrl, setInstagramUrl] = useState(initialData.instagramUrl);
  const [instagramEnabled, setInstagramEnabled] = useState(initialData.instagramEnabled);
  const [youtubeUrl, setYoutubeUrl] = useState(initialData.youtubeUrl);
  const [youtubeEnabled, setYoutubeEnabled] = useState(initialData.youtubeEnabled);
  const [kakaoUrl, setKakaoUrl] = useState(initialData.kakaoUrl);
  const [kakaoEnabled, setKakaoEnabled] = useState(initialData.kakaoEnabled);

  useEffect(() => {
    setPhone(initialData.phone);
    setEmail(initialData.email);
    setFacebookUrl(initialData.facebookUrl);
    setFacebookEnabled(initialData.facebookEnabled);
    setInstagramUrl(initialData.instagramUrl);
    setInstagramEnabled(initialData.instagramEnabled);
    setYoutubeUrl(initialData.youtubeUrl);
    setYoutubeEnabled(initialData.youtubeEnabled);
    setKakaoUrl(initialData.kakaoUrl);
    setKakaoEnabled(initialData.kakaoEnabled);
  }, [initialData]);

  const handleSave = async () => {
    try {
      const promises = [
        websiteAPI.updateTextSetting('footer_phone', phone),
        websiteAPI.updateTextSetting('footer_email', email),

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
      if (kakaoUrl || kakaoEnabled) {
        promises.push(websiteAPI.updateTextSetting('footer_kakao_url', kakaoUrl || '-'));
        promises.push(websiteAPI.updateTextSetting('footer_kakao_enabled', kakaoEnabled ? 'true' : 'false'));
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

        {/* 카카오톡 채널 */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={kakaoEnabled}
              onChange={(e) => setKakaoEnabled(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              카카오톡 채널 버튼 표시
            </label>
          </div>
          <input
            type="url"
            value={kakaoUrl}
            onChange={(e) => setKakaoUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://pf.kakao.com/_xxxxx (선택사항)"
            disabled={!kakaoEnabled}
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
