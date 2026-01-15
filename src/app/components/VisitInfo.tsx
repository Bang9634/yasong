import { Clock, DollarSign, Phone, Mail, Info } from 'lucide-react';

export function VisitInfo() {
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
              <div className="flex justify-between border-b border-teal-200 pb-3">
                <span>화요일 - 금요일</span>
                <span className="text-teal-700">10:00 - 18:00</span>
              </div>
              <div className="flex justify-between border-b border-teal-200 pb-3">
                <span>토요일 - 일요일</span>
                <span className="text-teal-700">10:00 - 19:00</span>
              </div>
              <div className="flex justify-between border-b border-teal-200 pb-3">
                <span>공휴일</span>
                <span className="text-teal-700">10:00 - 18:00</span>
              </div>
              <div className="flex justify-between text-red-600 pt-2">
                <span>휴관일</span>
                <span>매주 월요일, 1월 1일, 설날·추석 당일</span>
              </div>
              <div className="bg-amber-50 p-4 rounded mt-4 border-l-4 border-amber-500">
                <p className="text-sm text-gray-700">
                  <Info className="w-4 h-4 inline mr-1" />
                  입장 마감은 폐관 30분 전까지입니다
                </p>
              </div>
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
              <div className="flex justify-between border-b border-teal-200 pb-3">
                <span>성인 (만 19세 이상)</span>
                <span className="text-teal-700">5,000원</span>
              </div>
              <div className="flex justify-between border-b border-teal-200 pb-3">
                <span>청소년 (만 13-18세)</span>
                <span className="text-teal-700">3,000원</span>
              </div>
              <div className="flex justify-between border-b border-teal-200 pb-3">
                <span>어린이 (만 7-12세)</span>
                <span className="text-teal-700">2,000원</span>
              </div>
              <div className="flex justify-between border-b border-teal-200 pb-3">
                <span>단체 (20인 이상)</span>
                <span className="text-amber-600">개인요금의 20% 할인</span>
              </div>
              <div className="bg-amber-50 p-4 rounded mt-4 border-l-4 border-amber-500">
                <p className="text-sm text-gray-700 mb-1">
                  <strong>무료 관람:</strong>
                </p>
                <p className="text-sm text-gray-700">
                  만 6세 이하, 만 65세 이상, 국가유공자, 장애인 및 동반 1인
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 편의시설 */}
        <div className="bg-teal-50 p-8 rounded-lg mb-12 border border-teal-200">
          <h3 className="text-2xl mb-8 text-center text-teal-900">편의시설</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🅿️</span>
              </div>
              <h4 className="text-teal-800 mb-2">무료 주차장</h4>
              <p className="text-sm text-gray-600">승용차 200대 수용 가능</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">☕</span>
              </div>
              <h4 className="text-teal-800 mb-2">카페테리아</h4>
              <p className="text-sm text-gray-600">음료 및 간단한 식사</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🛍️</span>
              </div>
              <h4 className="text-teal-800 mb-2">뮤지엄샵</h4>
              <p className="text-sm text-gray-600">기념품 및 문화상품</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">♿</span>
              </div>
              <h4 className="text-teal-800 mb-2">장애인 편의시설</h4>
              <p className="text-sm text-gray-600">휠체어 대여 가능</p>
            </div>
          </div>
        </div>

        {/* 관람 에티켓 */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-8 rounded-lg shadow-lg mb-12">
          <h3 className="text-2xl mb-6 border-b-2 border-amber-400 pb-3">관람 에티켓</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p>• 전시실 내에서는 정숙해 주세요</p>
              <p>• 작품 촬영 시 플래시는 사용하지 말아 주세요</p>
              <p>• 작품에 손을 대지 말아 주세요</p>
            </div>
            <div className="space-y-2">
              <p>• 음식물 반입을 금지합니다</p>
              <p>• 큰 가방은 물품보관소에 맡겨주세요</p>
              <p>• 애완동물 출입을 제한합니다</p>
            </div>
          </div>
        </div>

        {/* 문의 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center mr-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl text-teal-900">전화 문의</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-teal-700 text-sm mb-1">대표 전화</p>
                <p className="text-2xl text-gray-800">054-870-6000</p>
              </div>
              <div>
                <p className="text-teal-700 text-sm mb-1">교육 프로그램</p>
                <p className="text-xl text-gray-800">054-870-6002</p>
              </div>
              <p className="text-sm text-gray-600 mt-4">운영시간 내 상담 가능</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center mr-3">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl text-teal-900">이메일 문의</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-teal-700 text-sm mb-1">일반 문의</p>
                <p className="text-lg text-gray-800">info@yasong-museum.kr</p>
              </div>
              <div>
                <p className="text-teal-700 text-sm mb-1">단체 관람 예약</p>
                <p className="text-lg text-gray-800">reservation@yasong-museum.kr</p>
              </div>
              <p className="text-sm text-gray-600 mt-4">24시간 접수 가능 (답변: 평일 기준 1-2일 소요)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
