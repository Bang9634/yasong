import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: '이원좌 작품집',
    price: '35,000원',
    category: '도서',
    image: 'https://images.unsplash.com/photo-1689070754977-98dc22525adc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBzaG9wJTIwZ2lmdHN8ZW58MXx8fHwxNzY4NDUzODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '화백의 대표작 120점을 수록한 작품집'
  },
  {
    id: 2,
    name: '엽서 세트 (10장)',
    price: '12,000원',
    category: '문구',
    image: 'https://images.unsplash.com/photo-1762006496608-62c637aa1ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmllbnRhbCUyMGFydCUyMGNhbGxpZ3JhcGh5fGVufDF8fHx8MTc2ODQ1MzgxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '대표작 이미지가 담긴 고급 엽서'
  },
  {
    id: 3,
    name: '에코백',
    price: '18,000원',
    category: '잡화',
    image: 'https://images.unsplash.com/photo-1689070754977-98dc22525adc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBzaG9wJTIwZ2lmdHN8ZW58MXx8fHwxNzY4NDUzODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '청송의 아침 작품이 프린트된 에코백'
  },
  {
    id: 4,
    name: '머그컵',
    price: '15,000원',
    category: '생활용품',
    image: 'https://images.unsplash.com/photo-1689070754977-98dc22525adc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBzaG9wJTIwZ2lmdHN8ZW58MXx8fHwxNzY4NDUzODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '화백의 작품이 담긴 도자기 머그컵'
  },
  {
    id: 5,
    name: '액자 (소)',
    price: '45,000원',
    category: '액자',
    image: 'https://images.unsplash.com/photo-1694637110471-c1ffc862dd67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwbGFuZHNjYXBlJTIwcGFpbnRpbmd8ZW58MXx8fHwxNzY4NDUzODE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '작품 복제 프린트 액자 (30x40cm)'
  },
  {
    id: 6,
    name: '노트북',
    price: '8,000원',
    category: '문구',
    image: 'https://images.unsplash.com/photo-1689070754977-98dc22525adc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBzaG9wJTIwZ2lmdHN8ZW58MXx8fHwxNzY4NDUzODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '미술관 로고가 새겨진 고급 노트'
  }
];

export function MuseumShop() {
  return (
    <section id="shop" className="py-20 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-teal-800 mr-3" />
            <h2 className="text-4xl sm:text-5xl text-teal-900">뮤지엄샵</h2>
          </div>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            이원좌 화백의 예술 세계를 담은 다양한 문화상품을 만나보세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-teal-100 group"
            >
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-teal-700 text-white text-xs px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl mb-2 text-teal-900">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-teal-700">{product.price}</span>
                  <button className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors">
                    구매하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 뮤지엄샵 안내 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-teal-100">
            <h3 className="text-2xl mb-6 text-teal-900 border-b-2 border-teal-200 pb-3">운영 안내</h3>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-teal-700">위치</span>
                <span>미술관 1층 로비</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-teal-700">운영 시간</span>
                <span>10:00 - 18:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-teal-700">휴무일</span>
                <span>매주 월요일</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-teal-700">결제 방법</span>
                <span>현금, 카드</span>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  ※ 관람권 미소지 시에도 뮤지엄샵 이용 가능
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-700 to-teal-600 text-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl mb-6 border-b-2 border-amber-400 pb-3">온라인 구매</h3>
            <div className="space-y-4 mb-6">
              <p className="leading-relaxed">
                방문이 어려우신 분들을 위해 온라인 쇼핑몰을 준비 중입니다.
              </p>
              <div className="bg-teal-800 p-4 rounded-lg">
                <p className="text-amber-200 mb-2">이메일 문의</p>
                <p>shop@yasong-museum.kr</p>
              </div>
              <div className="bg-teal-800 p-4 rounded-lg">
                <p className="text-amber-200 mb-2">전화 문의</p>
                <p>054-870-6001</p>
                <p className="text-sm text-teal-200 mt-1">(평일 10:00-17:00)</p>
              </div>
            </div>
            <div className="text-sm text-teal-100">
              <p>• 택배 발송 가능 (배송비 별도)</p>
              <p>• 대량 구매 시 할인 혜택</p>
              <p>• 기업 및 단체 주문 환영</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
