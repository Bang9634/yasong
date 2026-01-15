import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Palette, Users, BookOpen, Lightbulb } from 'lucide-react';

interface Program {
  id: number;
  title: string;
  description: string;
  target: string;
  schedule: string;
  icon: 'palette' | 'users' | 'book' | 'lightbulb';
}

const programs: Program[] = [
  {
    id: 1,
    title: '어린이 미술교실',
    description: '초등학생을 대상으로 한 창의 미술 프로그램입니다. 다양한 재료와 기법을 통해 예술적 감성을 키웁니다.',
    target: '초등학생 1-6학년',
    schedule: '매주 토요일 10:00-12:00',
    icon: 'palette'
  },
  {
    id: 2,
    title: '성인 수채화 교실',
    description: '수채화의 기초부터 심화까지 단계별로 배우는 프로그램입니다. 이원좌 화백의 기법을 중점적으로 학습합니다.',
    target: '성인 (초급/중급/고급)',
    schedule: '매주 수요일 14:00-16:00',
    icon: 'users'
  },
  {
    id: 3,
    title: '미술관 아카데미',
    description: '미술사와 작품 감상법을 배우는 이론 교육 프로그램입니다. 전문 큐레이터의 강의로 진행됩니다.',
    target: '일반인 누구나',
    schedule: '매월 첫째, 셋째 목요일 19:00-21:00',
    icon: 'book'
  },
  {
    id: 4,
    title: '가족 미술 체험',
    description: '가족이 함께 참여하는 미술 체험 프로그램입니다. 협동 작품 제작을 통해 소통의 시간을 갖습니다.',
    target: '가족 단위',
    schedule: '매월 둘째, 넷째 일요일 14:00-16:00',
    icon: 'lightbulb'
  }
];

const IconComponent = ({ type }: { type: string }) => {
  switch (type) {
    case 'palette':
      return <Palette className="w-8 h-8" />;
    case 'users':
      return <Users className="w-8 h-8" />;
    case 'book':
      return <BookOpen className="w-8 h-8" />;
    case 'lightbulb':
      return <Lightbulb className="w-8 h-8" />;
    default:
      return <Palette className="w-8 h-8" />;
  }
};

export function Programs() {
  return (
    <section id="programs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">교육 프로그램</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            다양한 연령층을 위한 미술 교육 프로그램을 운영하고 있습니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-gradient-to-br from-white to-teal-50 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow border border-teal-100"
            >
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-teal-700 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <IconComponent type={program.icon} />
                </div>
                <div>
                  <h3 className="text-2xl mb-2 text-teal-900">{program.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{program.description}</p>
                </div>
              </div>
              <div className="space-y-2 border-t border-teal-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-teal-700">대상</span>
                  <span className="text-gray-700">{program.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">일정</span>
                  <span className="text-gray-700">{program.schedule}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 체험 활동 */}
        <div className="mb-16">
          <h3 className="text-3xl mb-8 text-center text-teal-900">체험 활동</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-teal-100">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎨</span>
              </div>
              <h4 className="text-xl mb-3 text-teal-900">작품 모사 체험</h4>
              <p className="text-gray-700 leading-relaxed">
                이원좌 화백의 작품을 직접 모사해보는 체험 프로그램입니다. 
                재료는 미술관에서 제공합니다.
              </p>
              <p className="text-teal-700 mt-4 text-sm">참가비: 5,000원</p>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-teal-100">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📷</span>
              </div>
              <h4 className="text-xl mb-3 text-teal-900">야외 사생 대회</h4>
              <p className="text-gray-700 leading-relaxed">
                연 2회(봄, 가을) 주왕산 일대에서 진행되는 사생대회입니다. 
                우수작은 미술관에 전시됩니다.
              </p>
              <p className="text-teal-700 mt-4 text-sm">참가비: 무료</p>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-teal-100">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🖌️</span>
              </div>
              <h4 className="text-xl mb-3 text-teal-900">전통 먹그림 체험</h4>
              <p className="text-gray-700 leading-relaxed">
                붓과 먹을 이용한 전통 회화 체험 프로그램입니다. 
                동양화의 기초를 배울 수 있습니다.
              </p>
              <p className="text-teal-700 mt-4 text-sm">참가비: 3,000원</p>
            </div>
          </div>
        </div>

        {/* 신청 안내 */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl mb-6 text-center border-b-2 border-amber-400 pb-4">프로그램 신청 안내</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl mb-4 text-amber-200">신청 방법</h4>
              <ul className="space-y-2">
                <li>• 홈페이지 온라인 신청 (준비 중)</li>
                <li>• 전화 신청: 054-870-6000</li>
                <li>• 방문 신청: 미술관 안내데스크</li>
                <li>• 신청 기간: 프로그램 시작 2주 전부터</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl mb-4 text-amber-200">유의사항</h4>
              <ul className="space-y-2">
                <li>• 선착순 마감 (정원 초과 시 대기)</li>
                <li>• 취소는 시작 3일 전까지 가능</li>
                <li>• 재료비는 별도 수납</li>
                <li>• 단체 신청은 별도 문의</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-lg">
              프로그램 신청하기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
