import { MapPin, Bus, Train, Car, Navigation } from 'lucide-react';

export function Location() {
  return (
    <section id="location" className="py-20 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">오시는 길</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          <div className="flex items-center justify-center text-lg text-gray-700 mb-2">
            <MapPin className="w-6 h-6 mr-2 text-teal-600" />
            경상북도 청송군 청송읍 월막길 123
          </div>
          <p className="text-gray-600">우편번호: 37420</p>
        </div>

        {/* 지도 영역 */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-12 border-2 border-teal-200">
          <div className="relative h-96 bg-gradient-to-br from-teal-100 via-teal-50 to-emerald-50 flex items-center justify-center">
            <div className="text-center">
              <Navigation className="w-20 h-20 text-teal-600 mx-auto mb-4" />
              <p className="text-2xl text-teal-800 mb-2">지도 영역</p>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                실제 구현 시 카카오맵 또는 네이버 지도 API 연동
              </p>
              <div className="mt-6 space-x-4">
                <button className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors">
                  카카오맵으로 보기
                </button>
                <button className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors">
                  네이버 지도로 보기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 교통수단별 안내 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* 자가용 */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-teal-700 rounded-full flex items-center justify-center mr-4">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-teal-900">자가용</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="border-l-4 border-teal-600 pl-4">
                <p className="text-teal-700 mb-2">서울 방면</p>
                <p className="text-sm leading-relaxed">
                  중앙고속도로 → 영천IC → 국도 28호선 → 청송 방면<br />
                  <span className="text-teal-600">약 3시간 30분 소요</span>
                </p>
              </div>
              <div className="border-l-4 border-teal-600 pl-4">
                <p className="text-teal-700 mb-2">대구 방면</p>
                <p className="text-sm leading-relaxed">
                  중앙고속도로 → 영천IC → 국도 28호선 → 청송 방면<br />
                  <span className="text-teal-600">약 1시간 20분 소요</span>
                </p>
              </div>
              <div className="border-l-4 border-teal-600 pl-4">
                <p className="text-teal-700 mb-2">부산 방면</p>
                <p className="text-sm leading-relaxed">
                  경부고속도로 → 영천IC → 국도 28호선 → 청송 방면<br />
                  <span className="text-teal-600">약 2시간 30분 소요</span>
                </p>
              </div>
              <div className="pt-4 border-t border-teal-200 bg-teal-50 p-3 rounded">
                <p className="text-sm text-teal-800">
                  <strong>주차:</strong> 무료 주차장 200대 가능
                </p>
              </div>
            </div>
          </div>

          {/* 대중교통 - 버스 */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-teal-700 rounded-full flex items-center justify-center mr-4">
                <Bus className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-teal-900">버스</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="border-l-4 border-amber-600 pl-4">
                <p className="text-amber-700 mb-2">시외버스</p>
                <p className="text-sm leading-relaxed mb-2">
                  <strong>동서울터미널 → 청송터미널</strong><br />
                  1일 4회 운행 (약 4시간 소요)
                </p>
                <p className="text-sm leading-relaxed">
                  <strong>대구 동부터미널 → 청송터미널</strong><br />
                  1일 10회 운행 (약 1시간 40분 소요)
                </p>
              </div>
              <div className="border-l-4 border-amber-600 pl-4">
                <p className="text-amber-700 mb-2">시내버스</p>
                <p className="text-sm leading-relaxed mb-1">
                  <strong>청송터미널 → 야송미술관 정류장</strong>
                </p>
                <p className="text-sm text-gray-600">
                  11번, 22번 버스 이용<br />
                  <span className="text-amber-600">약 15분 소요, 배차 간격 30분</span>
                </p>
              </div>
              <div className="pt-4 border-t border-teal-200 bg-amber-50 p-3 rounded">
                <p className="text-sm text-amber-800">
                  야송미술관 정류장 하차 후 도보 3분
                </p>
              </div>
            </div>
          </div>

          {/* 기차 */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-teal-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-teal-700 rounded-full flex items-center justify-center mr-4">
                <Train className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-teal-900">기차</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="border-l-4 border-emerald-600 pl-4">
                <p className="text-emerald-700 mb-2">KTX</p>
                <p className="text-sm leading-relaxed mb-2">
                  <strong>서울역 → 안동역</strong><br />
                  1일 15회 운행 (약 2시간 30분)
                </p>
                <p className="text-sm leading-relaxed">
                  <strong>부산역 → 안동역</strong><br />
                  1일 8회 운행 (약 2시간 40분)
                </p>
              </div>
              <div className="border-l-4 border-emerald-600 pl-4">
                <p className="text-emerald-700 mb-2">안동역 → 미술관</p>
                <p className="text-sm leading-relaxed mb-1">
                  <strong>안동역에서 시외버스 이용</strong>
                </p>
                <p className="text-sm text-gray-600">
                  안동 → 청송 시외버스<br />
                  <span className="text-emerald-600">1일 8회 운행, 약 50분 소요</span>
                </p>
              </div>
              <div className="pt-4 border-t border-teal-200 bg-emerald-50 p-3 rounded">
                <p className="text-sm text-emerald-800">
                  청송터미널에서 시내버스로 환승
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 주차 및 셔틀 안내 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-teal-700 text-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl mb-6 border-b-2 border-amber-400 pb-3">주차 안내</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-teal-600 pb-2">
                <span>주차 요금</span>
                <span className="text-amber-200">무료</span>
              </div>
              <div className="flex justify-between border-b border-teal-600 pb-2">
                <span>주차 가능 대수</span>
                <span>승용차 200대</span>
              </div>
              <div className="flex justify-between border-b border-teal-600 pb-2">
                <span>장애인 주차구역</span>
                <span>10대</span>
              </div>
              <div className="flex justify-between border-b border-teal-600 pb-2">
                <span>대형버스 주차</span>
                <span>10대 (사전 예약 필수)</span>
              </div>
              <div className="flex justify-between border-b border-teal-600 pb-2">
                <span>전기차 충전소</span>
                <span className="text-amber-200">4대 (무료)</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>주차장 이용시간</span>
                <span>09:00 - 20:00</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl mb-6 text-teal-900 border-b-2 border-amber-400 pb-3">
              주말 셔틀버스 운행
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <p className="text-teal-700 mb-2">운행 구간</p>
                <p className="text-sm">청송터미널 ↔ 야송미술관</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <p className="text-teal-700 mb-2">운행 시간</p>
                <p className="text-sm">
                  토·일요일 및 공휴일<br />
                  10:00 / 11:00 / 14:00 / 16:00 출발
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <p className="text-teal-700 mb-2">이용 요금</p>
                <p className="text-sm text-amber-600">무료</p>
              </div>
              <p className="text-sm text-gray-600 bg-white p-3 rounded border-l-4 border-teal-600">
                ※ 날씨 및 행사 일정에 따라 변경될 수 있습니다
              </p>
            </div>
          </div>
        </div>

        {/* 주변 관광지 */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-lg border border-teal-200">
          <h3 className="text-2xl mb-6 text-center text-teal-900">주변 관광지</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-3xl mb-2">🏔️</div>
              <h4 className="text-teal-800 mb-2">주왕산 국립공원</h4>
              <p className="text-sm text-gray-600">차량 15분 거리</p>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-3xl mb-2">🌸</div>
              <h4 className="text-teal-800 mb-2">신성계곡</h4>
              <p className="text-sm text-gray-600">차량 20분 거리</p>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-3xl mb-2">🏡</div>
              <h4 className="text-teal-800 mb-2">송소고택</h4>
              <p className="text-sm text-gray-600">차량 10분 거리</p>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-3xl mb-2">🍎</div>
              <h4 className="text-teal-800 mb-2">청송사과 직판장</h4>
              <p className="text-sm text-gray-600">차량 5분 거리</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
