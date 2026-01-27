import { useState } from 'react';
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

  const handleSave = async () => {
    try {
      await Promise.all([
        websiteAPI.updateTextSetting('footer_description', description),
        websiteAPI.updateTextSetting('footer_phone', phone),
        websiteAPI.updateTextSetting('footer_phone_hours', phoneHours),
        websiteAPI.updateTextSetting('footer_email', email),
        websiteAPI.updateTextSetting('footer_address', address),
        websiteAPI.updateTextSetting('footer_operating_hours', operatingHours),
        websiteAPI.updateTextSetting('footer_closed_day', closedDay),
        websiteAPI.updateTextSetting('footer_bottom_info', bottomInfo),
        websiteAPI.updateTextSetting('footer_copyright', copyright),
      ]);
      
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

      <button
        onClick={handleSave}
        className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors"
      >
        저장
      </button>
    </div>
  );
}
