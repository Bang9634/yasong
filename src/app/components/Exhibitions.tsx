import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface Exhibition {
  id: number;
  title: string;
  artist: string;
  period: string;
  location: string;
  time: string;
  image: string;
  status: 'current' | 'upcoming' | 'past';
  description: string;
}

const exhibitions: Exhibition[] = [
  {
    id: 1,
    title: '이원좌 화백 탄생 100주년 특별전',
    artist: '이원좌',
    period: '2026.03.01 - 2026.05.31',
    location: '제1, 2전시실',
    time: '10:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1761452789206-b997a8da6bc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2ODQ1MzgxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    status: 'upcoming',
    description: '화백의 생애와 예술 세계를 조명하는 대규모 회고전'
  },
  {
    id: 2,
    title: '청송, 그 빛과 색채',
    artist: '이원좌',
    period: '2026.01.15 - 2026.02.28',
    location: '제1전시실',
    time: '10:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1694637110471-c1ffc862dd67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwbGFuZHNjYXBlJTIwcGFpbnRpbmd8ZW58MXx8fHwxNzY4NDUzODE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    status: 'current',
    description: '청송의 사계절을 담은 풍경화 30점 전시'
  },
  {
    id: 3,
    title: '한국 현대미술의 거장들',
    artist: '단체전',
    period: '2026.01.15 - 2026.03.15',
    location: '제2전시실',
    time: '10:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1565799515768-2dcfd834625c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzY4NDI5ODU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    status: 'current',
    description: '한국 현대미술을 대표하는 작가 15인의 작품 전시'
  },
  {
    id: 4,
    title: '자연, 그 영원한 스승',
    artist: '이원좌',
    period: '2026.02.01 - 2026.04.30',
    location: '야외 조각공원',
    time: '09:00 - 19:00',
    image: 'https://images.unsplash.com/photo-1767478253343-0253c6367041?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY3VscHR1cmUlMjBvdXRkb29yfGVufDF8fHx8MTc2ODQ1Mjk3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    status: 'upcoming',
    description: '자연을 주제로 한 조각 작품 야외 전시'
  }
];

export function Exhibitions() {
  const currentExhibitions = exhibitions.filter(e => e.status === 'current');
  const upcomingExhibitions = exhibitions.filter(e => e.status === 'upcoming');

  return (
    <section id="exhibitions" className="py-20 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">전시 일정</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            현재 진행 중인 전시와 다가오는 전시를 확인하세요
          </p>
        </div>

        {/* 현재 전시 */}
        <div className="mb-16">
          <h3 className="text-3xl mb-8 text-teal-800 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
            현재 전시
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {currentExhibitions.map((exhibition) => (
              <div
                key={exhibition.id}
                className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow border-2 border-teal-200"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={exhibition.image}
                    alt={exhibition.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-red-600 text-white rounded-full shadow-lg">
                      전시중
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h4 className="text-3xl mb-2 text-teal-900">{exhibition.title}</h4>
                  <p className="text-xl text-teal-700 mb-4">{exhibition.artist}</p>
                  <p className="text-gray-700 mb-6 leading-relaxed">{exhibition.description}</p>
                  
                  <div className="space-y-3 border-t border-teal-100 pt-6">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-teal-600" />
                      <span>{exhibition.period}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-teal-600" />
                      <span>{exhibition.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-teal-600" />
                      <span>{exhibition.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 예정 전시 */}
        <div>
          <h3 className="text-3xl mb-8 text-teal-800 flex items-center">
            <span className="w-3 h-3 bg-amber-500 rounded-full mr-3"></span>
            예정 전시
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {upcomingExhibitions.map((exhibition) => (
              <div
                key={exhibition.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-teal-100"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={exhibition.image}
                    alt={exhibition.title}
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-amber-600 text-white rounded-full shadow-lg">
                      예정
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-2xl mb-2 text-teal-900">{exhibition.title}</h4>
                  <p className="text-lg text-teal-700 mb-3">{exhibition.artist}</p>
                  <p className="text-gray-700 mb-4 leading-relaxed">{exhibition.description}</p>
                  
                  <div className="space-y-2 border-t border-teal-100 pt-4">
                    <div className="flex items-center text-gray-700 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                      <span>{exhibition.period}</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                      <span>{exhibition.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 전시 관람 안내 */}
        <div className="mt-16 bg-gradient-to-r from-teal-700 to-teal-600 text-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl mb-6 border-b-2 border-amber-400 pb-3">전시 관람 안내</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl mb-3 text-amber-200">관람 시간</h4>
              <p className="mb-2">화-금: 10:00 - 18:00</p>
              <p className="mb-2">토-일: 10:00 - 19:00</p>
              <p className="text-amber-200">※ 입장 마감: 폐관 30분 전</p>
            </div>
            <div>
              <h4 className="text-xl mb-3 text-amber-200">도슨트 프로그램</h4>
              <p className="mb-2">토·일요일 11:00, 14:00, 16:00 (회당 약 40분)</p>
              <p className="mb-2">평일 단체 관람객 사전 예약 가능</p>
              <p className="text-amber-200">※ 문의: 054-870-6000</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
