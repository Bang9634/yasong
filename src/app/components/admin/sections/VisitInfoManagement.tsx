import { useState, useEffect } from 'react';
import { Clock, DollarSign, Info } from 'lucide-react';
import { websiteAPI } from '@/utils/api';

interface VisitInfoData {
  operatingHours: string;
  closedDay: string;
  admissionFee: string;
  etiquette: string;
  phone: string;
  email: string;
}

interface Props {
  initialData: VisitInfoData;
}

export function VisitInfoManagement({ initialData }: Props) {
  const [visitInfo, setVisitInfo] = useState<VisitInfoData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setVisitInfo(initialData);
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!visitInfo.operatingHours || !visitInfo.closedDay || !visitInfo.admissionFee || !visitInfo.etiquette || 
        !visitInfo.phone || !visitInfo.email) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all([
        websiteAPI.updateTextSetting('visit_operating_hours', visitInfo.operatingHours),
        websiteAPI.updateTextSetting('visit_closed_day', visitInfo.closedDay),
        websiteAPI.updateTextSetting('visit_admission_fee', visitInfo.admissionFee),
        websiteAPI.updateTextSetting('visit_etiquette', visitInfo.etiquette),
        websiteAPI.updateTextSetting('visit_phone', visitInfo.phone),
        websiteAPI.updateTextSetting('visit_email', visitInfo.email),
        // 푸터 설정도 동기화
        websiteAPI.updateTextSetting('footer_operating_hours', visitInfo.operatingHours),
        websiteAPI.updateTextSetting('footer_closed_day', visitInfo.closedDay),
      ]);
      alert('관람 안내 정보가 저장되었습니다. (푸터도 자동으로 업데이트되었습니다)');
    } catch (error) {
      console.error('Failed to save visit info:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-teal-900 flex items-center">
          <Info className="w-7 h-7 mr-3 text-teal-700" />
          관람 안내 관리
        </h2>
        <p className="text-gray-600 mt-2">홈페이지의 관람 안내 정보를 관리합니다.</p>
      </div>

      <div className="space-y-6">
        {/* 운영 시간 */}
        <div>
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <Clock className="w-5 h-5 mr-2 text-teal-600" />
            운영 시간
          </label>
          <textarea
            value={visitInfo.operatingHours}
            onChange={(e) => setVisitInfo({ ...visitInfo, operatingHours: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows={5}
            placeholder="예:&#10;화요일 - 금요일: 10:00 - 18:00&#10;토요일 - 일요일: 10:00 - 19:00&#10;공휴일: 10:00 - 18:00&#10;※ 입장 마감은 폐관 30분 전까지입니다"
          />
          <p className="text-sm text-gray-500 mt-2">
            각 줄에 요일과 시간을 입력하세요. (예: 화요일 - 금요일: 10:00 - 18:00)
          </p>
        </div>

        {/* 휴관일 */}
        <div>
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <Clock className="w-5 h-5 mr-2 text-teal-600" />
            휴관일
          </label>
          <input
            type="text"
            value={visitInfo.closedDay}
            onChange={(e) => setVisitInfo({ ...visitInfo, closedDay: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="예: 매주 월요일, 1월 1일, 설날·추석 당일"
          />
          <p className="text-sm text-gray-500 mt-2">
            휴관일 정보를 입력하세요. (예: 매주 월요일, 1월 1일, 설날·추석 당일)
          </p>
        </div>

        {/* 관람료 */}
        <div>
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <DollarSign className="w-5 h-5 mr-2 text-teal-600" />
            관람료
          </label>
          <textarea
            value={visitInfo.admissionFee}
            onChange={(e) => setVisitInfo({ ...visitInfo, admissionFee: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows={8}
            placeholder="예:&#10;성인 (만 19세 이상): 5,000원&#10;청소년 (만 13-18세): 3,000원&#10;어린이 (만 7-12세): 2,000원&#10;단체 (20인 이상): 개인요금의 20% 할인&#10;무료 관람: 만 6세 이하, 만 65세 이상, 국가유공자, 장애인 및 동반 1인"
          />
          <p className="text-sm text-gray-500 mt-2">
            각 줄에 연령대와 요금을 입력하세요. (예: 성인 (만 19세 이상): 5,000원)
          </p>
        </div>

        {/* 관람 에티켓 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            관람 에티켓
          </label>
          <textarea
            value={visitInfo.etiquette}
            onChange={(e) => setVisitInfo({ ...visitInfo, etiquette: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows={6}
            placeholder="예:&#10;• 전시실 내에서는 정숙해 주세요&#10;• 작품 촬영 시 플래시는 사용하지 말아 주세요&#10;• 작품에 손을 대지 말아 주세요&#10;• 음식물 반입을 금지합니다&#10;• 큰 가방은 물품보관소에 맡겨주세요&#10;• 애완동물 출입을 제한합니다"
          />
          <p className="text-sm text-gray-500 mt-2">
            각 줄에 에티켓 항목을 입력하세요. (• 기호로 시작)
          </p>
        </div>

        {/* 전화 문의 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            전화 문의
          </label>
          <textarea
            value={visitInfo.phone}
            onChange={(e) => setVisitInfo({ ...visitInfo, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows={4}
            placeholder="예:&#10;대표 전화: 054-870-6000&#10;교육 프로그램: 054-870-6002&#10;※ 운영시간 내 상담 가능"
          />
          <p className="text-sm text-gray-500 mt-2">
            각 줄에 문의 항목과 전화번호를 입력하세요.
          </p>
        </div>

        {/* 이메일 문의 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            이메일 문의
          </label>
          <textarea
            value={visitInfo.email}
            onChange={(e) => setVisitInfo({ ...visitInfo, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows={4}
            placeholder="예:&#10;일반 문의: info@yasong-museum.kr&#10;단체 관람 예약: reservation@yasong-museum.kr&#10;※ 24시간 접수 가능 (답변: 평일 기준 1-2일 소요)"
          />
          <p className="text-sm text-gray-500 mt-2">
            각 줄에 문의 항목과 이메일 주소를 입력하세요.
          </p>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 disabled:bg-gray-400 transition-colors font-semibold"
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
