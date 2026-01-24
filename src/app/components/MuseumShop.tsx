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
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            * 청량대운도전시관에서 구매하실 수 있습니다
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
      </div>
    </section>
  );
}
