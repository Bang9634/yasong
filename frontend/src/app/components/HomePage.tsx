import { Header } from '@/app/components/Header';
import { Hero } from '@/app/components/Hero';
import { AboutStory } from '@/app/components/AboutStory';
import { Notice } from '@/app/components/Notice';
import { Contest } from '@/app/components/Contest';
import { Collections } from '@/app/components/Collections';
import { Footer } from '@/app/components/Footer';
import { useEffect } from 'react';
import { setPageSEO } from '@/utils/seo';
import { Exhibitions } from './Exhibitions';

export function HomePage() {
  useEffect(() => {
    setPageSEO({
      description: '야송 - 한국 근현대 미술의 거장, 이원좌 선생의 작품과 정신을 기리는 문화 공간',
      keywords: 'YASONG, 야송, 청송, 이원좌',
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <AboutStory />
        <Collections />
        <Exhibitions />
        <Contest />
        <Notice />      
      </main>
      <Footer />
    </div>
  );
}
