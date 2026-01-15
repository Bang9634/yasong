import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface Artwork {
  id: number;
  title: string;
  year: string;
  medium: string;
  size: string;
  image: string;
  description: string;
}

const artworks: Artwork[] = [
  {
    id: 1,
    title: '청송의 아침',
    year: '1985',
    medium: '캔버스에 유채',
    size: '130 x 162 cm',
    image: 'https://images.unsplash.com/photo-1694637110471-c1ffc862dd67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwbGFuZHNjYXBlJTIwcGFpbnRpbmd8ZW58MXx8fHwxNzY4NDUzODE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '청송의 새벽 안개를 서정적으로 표현한 대표작'
  },
  {
    id: 2,
    title: '주왕산 사계',
    year: '1992',
    medium: '캔버스에 유채',
    size: '162 x 130 cm',
    image: 'https://images.unsplash.com/photo-1761452789206-b997a8da6bc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2ODQ1MzgxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '주왕산의 사계절 변화를 한 화폭에 담은 역작'
  },
  {
    id: 3,
    title: '고향의 봄',
    year: '1998',
    medium: '캔버스에 유채',
    size: '100 x 80 cm',
    image: 'https://images.unsplash.com/photo-1762006496608-62c637aa1ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmllbnRhbCUyMGFydCUyMGNhbGxpZ3JhcGh5fGVufDF8fHx8MTc2ODQ1MzgxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '화백의 고향에 대한 애정이 담긴 서정적 풍경화'
  },
  {
    id: 4,
    title: '자연의 교향곡',
    year: '2005',
    medium: '캔버스에 유채',
    size: '145 x 112 cm',
    image: 'https://images.unsplash.com/photo-1531489500496-0e84f798da0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhaW50aW5nJTIwY29udGVtcG9yYXJ5fGVufDF8fHx8MTc2ODQ1Mjk3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '추상과 구상을 넘나드는 후기 대표작'
  },
  {
    id: 5,
    title: '청송 민가',
    year: '2010',
    medium: '캔버스에 유채',
    size: '80 x 100 cm',
    image: 'https://images.unsplash.com/photo-1575391142273-cbc677912f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGxhbmRzY2FwZSUyMG1vdW50YWlufGVufDF8fHx8MTc2ODQ1Mjk3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '전통 마을의 정취를 현대적 감각으로 재해석'
  },
  {
    id: 6,
    title: '생명의 숲',
    year: '2015',
    medium: '캔버스에 유채',
    size: '162 x 130 cm',
    image: 'https://images.unsplash.com/photo-1609224872430-4d1dade89a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBjb3VudHJ5c2lkZSUyMHJ1cmFsJTIwa29yZWF8ZW58MXx8fHwxNzY4NDUyOTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '자연의 생명력을 역동적으로 표현한 만년작'
  }
];

export function Collections() {
  return (
    <section id="collections" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">대표 소장품</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            이원좌 화백의 예술 세계를 대표하는 주요 작품들을 만나보세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-teal-100"
            >
              <div className="relative group">
                <ImageWithFallback
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/20 transition-colors"></div>
              </div>
              
              <div className="p-6 bg-gradient-to-b from-white to-teal-50">
                <h3 className="text-2xl mb-2 text-teal-900">{artwork.title}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>{artwork.year}</p>
                  <p>{artwork.medium}</p>
                  <p>{artwork.size}</p>
                </div>
                <p className="text-gray-700 leading-relaxed border-t border-teal-200 pt-4">
                  {artwork.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-teal-50 border-l-4 border-teal-700 p-8 rounded-lg">
          <h3 className="text-2xl mb-4 text-teal-900">소장품 안내</h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h4 className="text-teal-800 mb-3">상설 전시</h4>
              <p className="leading-relaxed">
                이원좌 화백의 대표작 40여 점을 상설 전시하고 있습니다. 
                초기작부터 후기작까지 화백의 예술 세계 변화를 한눈에 볼 수 있습니다.
              </p>
            </div>
            <div>
              <h4 className="text-teal-800 mb-3">순회 전시</h4>
              <p className="leading-relaxed">
                소장품 중 일부는 국내외 주요 미술관과의 교류 전시를 통해 
                더 많은 관람객들에게 소개되고 있습니다.
              </p>
            </div>
            <div>
              <h4 className="text-teal-800 mb-3">도슨트 프로그램</h4>
              <p className="leading-relaxed">
                매주 토·일요일 오후 2시, 전문 도슨트의 안내로 
                작품에 대한 깊이 있는 해설을 들으실 수 있습니다.
              </p>
            </div>
            <div>
              <h4 className="text-teal-800 mb-3">작품 도록</h4>
              <p className="leading-relaxed">
                소장품 전체를 수록한 작품 도록을 뮤지엄샵에서 
                구매하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
