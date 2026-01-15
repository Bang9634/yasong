import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Building2, Users, Award } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">미술관 연혁</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1565799515768-2dcfd834625c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzY4NDI5ODU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="야송미술관 전시실"
              className="w-full h-96 object-cover rounded-lg shadow-xl border-4 border-white"
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl mb-2 text-teal-800">설립 배경</h3>
                <p className="text-gray-700 leading-relaxed">
                  2019년 이원좌 화백의 작품 기증을 계기로 청송군과 경상북도의 지원을 받아 
                  2020년 10월 15일 개관하였습니다. 청송의 문화예술 진흥과 지역민의 
                  문화향유권 증진을 위해 설립되었습니다.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl mb-2 text-teal-800">운영 목표</h3>
                <p className="text-gray-700 leading-relaxed">
                  이원좌 화백의 예술 정신을 계승하고, 지역 문화예술 발전의 거점으로서 
                  다양한 전시와 교육 프로그램을 운영합니다. 국내외 우수 작가들의 작품을 
                  소개하며 문화 교류의 장을 마련하고 있습니다.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl mb-2 text-teal-800">주요 성과</h3>
                <p className="text-gray-700 leading-relaxed">
                  개관 이래 연평균 5만여 명의 관람객이 방문하고 있으며, 
                  2023년 대한민국 공공디자인대상을 수상하였습니다. 
                  지역 미술 교육의 중심지로 자리매김하고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 연혁 타임라인 */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-teal-100">
          <h3 className="text-3xl mb-8 text-center text-teal-900">주요 연혁</h3>
          <div className="space-y-6">
            <div className="flex items-start border-l-4 border-teal-600 pl-6 py-2">
              <div className="min-w-[100px] text-teal-700 mr-6">2020.10</div>
              <div className="text-gray-700">군립청송야송미술관 개관 (이원좌 화백 초대 관장 취임)</div>
            </div>
            <div className="flex items-start border-l-4 border-teal-500 pl-6 py-2">
              <div className="min-w-[100px] text-teal-700 mr-6">2021.03</div>
              <div className="text-gray-700">첫 기획전 '이원좌, 청송을 그리다' 개최</div>
            </div>
            <div className="flex items-start border-l-4 border-teal-500 pl-6 py-2">
              <div className="min-w-[100px] text-teal-700 mr-6">2021.09</div>
              <div className="text-gray-700">야외 조각공원 조성 완료</div>
            </div>
            <div className="flex items-start border-l-4 border-teal-500 pl-6 py-2">
              <div className="min-w-[100px] text-teal-700 mr-6">2022.05</div>
              <div className="text-gray-700">어린이 미술관 개관, 교육 프로그램 본격 운영</div>
            </div>
            <div className="flex items-start border-l-4 border-teal-500 pl-6 py-2">
              <div className="min-w-[100px] text-teal-700 mr-6">2023.07</div>
              <div className="text-gray-700">대한민국 공공디자인대상 수상</div>
            </div>
            <div className="flex items-start border-l-4 border-teal-500 pl-6 py-2">
              <div className="min-w-[100px] text-teal-700 mr-6">2024.04</div>
              <div className="text-gray-700">누적 관람객 20만 명 돌파</div>
            </div>
            <div className="flex items-start border-l-4 border-amber-500 pl-6 py-2">
              <div className="min-w-[100px] text-amber-700 mr-6">2026.03</div>
              <div className="text-gray-700">이원좌 화백 탄생 100주년 특별전 개최 예정</div>
            </div>
          </div>
        </div>

        {/* 시설 규모 */}
        <div className="grid sm:grid-cols-3 gap-8 mt-12">
          <div className="text-center p-8 bg-teal-700 text-white rounded-lg shadow-lg">
            <div className="text-5xl mb-4">3,500㎡</div>
            <div className="text-xl">전체 부지 면적</div>
          </div>
          <div className="text-center p-8 bg-teal-700 text-white rounded-lg shadow-lg">
            <div className="text-5xl mb-4">6개</div>
            <div className="text-xl">전시실 및 특별실</div>
          </div>
          <div className="text-center p-8 bg-teal-700 text-white rounded-lg shadow-lg">
            <div className="text-5xl mb-4">420점</div>
            <div className="text-xl">소장품 수</div>
          </div>
        </div>
      </div>
    </section>
  );
}
