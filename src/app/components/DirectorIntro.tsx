import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export function DirectorIntro() {
  return (
    <section id="director" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">초대 관장</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          <h3 className="text-3xl text-teal-800">이원좌 李元佐 (1941-2020)</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-6">
            <div className="bg-teal-50 p-8 rounded-lg border-l-4 border-teal-700">
              <h4 className="text-2xl mb-4 text-teal-900">화백 약력</h4>
              <div className="space-y-3 text-gray-700">
                <p>• 1941년 경상북도 청송 출생</p>
                <p>• 서울대학교 미술대학 회화과 졸업</p>
                <p>• 프랑스 파리 국립미술학교 수학</p>
                <p>• 대한민국 미술대전 심사위원 역임</p>
                <p>• 한국미술협회 이사장 역임</p>
                <p>• 서울대학교 미술대학 명예교수</p>
                <p>• 2020년 타계, 금관문화훈장 추서</p>
              </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-lg border-l-4 border-amber-600">
              <h4 className="text-2xl mb-4 text-teal-900">주요 수상</h4>
              <div className="space-y-3 text-gray-700">
                <p>• 1975년 국전 대통령상</p>
                <p>• 1982년 프랑스 살롱전 금상</p>
                <p>• 1990년 대한민국 예술원상</p>
                <p>• 1998년 은관문화훈장</p>
                <p>• 2015년 대한민국 문화예술상 본상</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-teal-900 to-teal-700 p-8 rounded-lg text-white">
              <h4 className="text-2xl mb-6 border-b-2 border-amber-400 pb-3">예술 세계</h4>
              <div className="space-y-4 leading-relaxed">
                <p>
                  이원좌 화백은 한국 근현대 미술사에서 독보적인 위치를 차지하는 서양화가입니다. 
                  그의 작품은 동양의 정신성과 서양의 조형성을 조화롭게 융합하여 독창적인 예술 세계를 구축했습니다.
                </p>
                <p>
                  특히 고향 청송의 자연을 주제로 한 풍경화는 한국적 정서와 현대적 감각이 어우러진 
                  걸작으로 평가받고 있습니다. 맑고 투명한 색채와 서정적인 구도는 보는 이로 하여금 
                  자연의 숭고함과 생명의 신비를 느끼게 합니다.
                </p>
                <p>
                  평생 동안 500여 회의 개인전과 1,000여 회의 단체전에 참여하며 한국 미술의 위상을 
                  세계에 알렸으며, 후학 양성에도 헌신하여 많은 제자들을 배출했습니다.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-teal-200">
              <blockquote className="italic text-gray-700 text-center text-lg leading-relaxed">
                "예술은 자연을 닮아가는 과정이며,<br />
                화가는 자연의 목소리를 전하는 사람이다."
                <footer className="mt-4 text-teal-800 not-italic">- 이원좌</footer>
              </blockquote>
            </div>
          </div>
        </div>

        <div className="bg-teal-50 p-8 rounded-lg">
          <h4 className="text-2xl mb-6 text-center text-teal-900">대표 컬렉션 기증</h4>
          <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            이원좌 화백은 생전에 자신의 대표작 120여 점과 습작 300여 점을 고향 청송군에 기증하였으며, 
            이를 바탕으로 2020년 군립청송야송미술관이 개관하였습니다. 
            미술관은 화백의 예술 정신을 계승하고 지역 문화예술 발전에 기여하고자 설립되었습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
