import { useState, useEffect } from 'react';
import { Clock, DollarSign, Phone, Mail, Info } from 'lucide-react';
import { websiteAPI } from '@/utils/api';

interface VisitInfoData {
  operatingHours: string;
  closedDay: string;
  admissionFee: string;
  etiquette: string;
  phone: string;
  email: string;
}

export function VisitInfo() {
  const [visitInfo, setVisitInfo] = useState<VisitInfoData>({
    operatingHours: '',
    closedDay: '',
    admissionFee: '',
    etiquette: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisitInfo();
  }, []);

  const loadVisitInfo = async () => {
    try {
      const [hoursData, closedDayData, feeData, etiquetteData, phoneData, emailData] = await Promise.all([
        websiteAPI.getTextSetting('visit_operating_hours'),
        websiteAPI.getTextSetting('visit_closed_day'),
        websiteAPI.getTextSetting('visit_admission_fee'),
        websiteAPI.getTextSetting('visit_etiquette'),
        websiteAPI.getTextSetting('visit_phone'),
        websiteAPI.getTextSetting('visit_email'),
      ]);

      setVisitInfo({
        operatingHours: hoursData.value || '',
        closedDay: closedDayData.value || '',
        admissionFee: feeData.value || '',
        etiquette: etiquetteData.value || '',
        phone: phoneData.value || '',
        email: emailData.value || '',
      });
    } catch (error) {
      console.error('Failed to load visit info:', error);
    } finally {
      setLoading(false);
    }
  };

  // 텍스트를 줄 단위로 파싱하는 헬퍼 함수
  const parseLines = (text: string) => {
    return text.split('\n').filter(line => line.trim());
  };

  // 관람 에티켓을 두 컬럼으로 나누는 함수
  const splitEtiquette = (text: string) => {
    const lines = parseLines(text);
    const mid = Math.ceil(lines.length / 2);
    return {
      left: lines.slice(0, mid),
      right: lines.slice(mid),
    };
  };

  if (loading) {
    return (
      <section id="visit" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">로딩 중...</div>
        </div>
      </section>
    );
  }

  const etiquetteSplit = splitEtiquette(visitInfo.etiquette);

  return (
    <section id="visit" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">관람 안내</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 운영 시간 */}
          <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-teal-700 rounded-full flex items-center justify-center mr-4">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-teal-900">운영 시간</h3>
            </div>
            <div className="space-y-3 text-gray-700">
              {visitInfo.operatingHours ? (
                parseLines(visitInfo.operatingHours).map((line, index, array) => (
                  <div
                    key={index}
                    className={`py-2 ${index < array.length - 1 ? 'border-b border-teal-200' : ''}`}
                  >
                    <p className="font-semibold text-lg leading-relaxed">• {line}</p>
                  </div>
                ))
              ) : (
                <p>운영 시간 정보가 없습니다.</p>
              )}
              {visitInfo.closedDay && (
                <div className="mt-4 pt-4 border-t border-teal-300">
                  <p className="text-amber-600 font-semibold">휴관일: {visitInfo.closedDay}</p>
                </div>
              )}
            </div>
          </div>

          {/* 관람료 */}
          <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-teal-700 rounded-full flex items-center justify-center mr-4">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-teal-900">관람료</h3>
            </div>
            <div className="space-y-3 text-gray-700">
              {visitInfo.admissionFee ? (
                parseLines(visitInfo.admissionFee).map((line, index, array) => (
                  <div
                    key={index}
                    className={`py-2 ${index < array.length - 1 ? 'border-b border-teal-200' : ''}`}
                  >
                    <p className="font-semibold text-lg leading-relaxed">• {line}</p>
                  </div>
                ))
              ) : (
                <p>관람료 정보가 없습니다.</p>
              )}
            </div>
          </div>
        </div>

        {/* 편의시설 */}
        <div className="bg-teal-50 p-8 rounded-lg mb-12 border border-teal-200">
          <h3 className="text-2xl mb-8 text-center text-teal-900">편의시설</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🅿️</span>
              </div>
              <h4 className="text-teal-800 mb-2">무료 주차장</h4>
              <p className="text-sm text-gray-600">주차장 무료 이용 및 대형 버스 주차 가능</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🛍️</span>
              </div>
              <h4 className="text-teal-800 mb-2">기념품점</h4>
              <p className="text-sm text-gray-600">기념품 및 문화상품</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">♿</span>
              </div>
              <h4 className="text-teal-800 mb-2">장애인 편의시설</h4>
              <p className="text-sm text-gray-600">장애인 화장실 이용 및 휠체어 대여 가능</p>
            </div>
          </div>
        </div>

        {/* 관람 에티켓 */}
        {visitInfo.etiquette && (
          <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-8 rounded-lg shadow-lg mb-12">
            <h3 className="text-2xl mb-6 border-b-2 border-amber-400 pb-3">관람 에티켓</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {etiquetteSplit.left.map((line, index) => (
                  <p key={index}>{line.startsWith('•') ? line : `• ${line}`}</p>
                ))}
              </div>
              <div className="space-y-2">
                {etiquetteSplit.right.map((line, index) => (
                  <p key={index}>{line.startsWith('•') ? line : `• ${line}`}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 문의 */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 전화 문의 */}
          <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center mr-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl text-teal-900">전화 문의</h3>
            </div>
            <div className="space-y-3 whitespace-pre-line text-gray-700">
              {visitInfo.phone || '전화 문의 정보가 없습니다.'}
            </div>
          </div>

          {/* 이메일 문의 */}
          <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center mr-3">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl text-teal-900">이메일 문의</h3>
            </div>
            <div className="space-y-3 whitespace-pre-line text-gray-700">
              {visitInfo.email || '이메일 문의 정보가 없습니다.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
