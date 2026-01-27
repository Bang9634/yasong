import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
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

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData>({
    description: '',
    phone: '',
    phoneHours: '',
    email: '',
    address: '',
    operatingHours: '',
    closedDay: '',
    bottomInfo: '',
    copyright: '',
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
      ]);

      setFooterData({
        description: descData.value || '이원좌 화백의 예술 정신을 계승하고\n지역 문화예술 발전에 기여하는\n청송의 문화 중심지',
        phone: phoneData.value || '054-870-6000',
        phoneHours: phoneHoursData.value || '평일 10:00-17:00',
        email: emailData.value || 'info@yasong-museum.kr',
        address: addressData.value || '경상북도 청송군\n청송읍 월막길 123',
        operatingHours: operatingHoursData.value || '화-금: 10:00 - 18:00\n토-일: 10:00 - 19:00',
        closedDay: closedDayData.value || '휴관: 매주 월요일',
        bottomInfo: bottomInfoData.value || '군립청송야송미술관 | 관장: 김문희 | 사업자등록번호: 123-45-67890',
        copyright: copyrightData.value || 'Copyright © 2026 Cheongsung Yasong Art Museum. All rights reserved.',
      });
    } catch (error) {
      console.error('Failed to load footer data:', error);
    }
  };

  const parseLines = (text: string): string[] => {
    return text.split('\n').filter(line => line.trim());
  };
  return (
    <footer className="bg-gradient-to-b from-teal-900 to-teal-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* 미술관 정보 */}
          <div className="md:col-span-2">
            <div className="border-2 border-amber-400 inline-block px-4 py-2 mb-4">
              <h3 className="text-2xl">군립청송야송미술관</h3>
            </div>
            <p className="text-teal-100 leading-relaxed mb-4">
              {parseLines(footerData.description).map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < parseLines(footerData.description).length - 1 && <br />}
                </span>
              ))}
            </p>
            <div className="flex space-x-4 mt-6">
              <button className="w-10 h-10 bg-teal-800 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-teal-800 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-teal-800 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="text-xl mb-6 text-amber-200 border-b border-teal-700 pb-2">연락처</h4>
            <div className="space-y-3 text-teal-100">
              <div className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">{footerData.phone}</p>
                  <p className="text-xs text-teal-300">{footerData.phoneHours}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">{footerData.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">
                    {parseLines(footerData.address).map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx < parseLines(footerData.address).length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 운영 시간 */}
          <div>
            <h4 className="text-xl mb-6 text-amber-200 border-b border-teal-700 pb-2">운영 시간</h4>
            <div className="space-y-3 text-teal-100">
              <div className="flex items-start">
                <Clock className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <div>
                  {parseLines(footerData.operatingHours).map((line, idx) => (
                    <p key={idx} className="text-white mb-1">{line}</p>
                  ))}
                  <p className="text-amber-300 text-sm mt-2">{footerData.closedDay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="border-t border-teal-800 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-teal-200">
            <button className="hover:text-amber-300 transition-colors">개인정보처리방침</button>
            <span className="text-teal-700">|</span>
            <button className="hover:text-amber-300 transition-colors">이용약관</button>
            <span className="text-teal-700">|</span>
            <button className="hover:text-amber-300 transition-colors">찾아오시는 길</button>
            <span className="text-teal-700">|</span>
            <button className="hover:text-amber-300 transition-colors">채용정보</button>
          </div>
        </div>

        <div className="border-t border-teal-800 pt-8">
          <div className="text-center text-teal-300 text-sm space-y-2">
            <p>{footerData.bottomInfo}</p>
            <p>{footerData.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
