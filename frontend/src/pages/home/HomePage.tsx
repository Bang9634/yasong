import { Header } from '@/components/layout/Header';
import { Hero } from '@/pages/home/components/Hero';
import { AboutStorySection } from '@/pages/home/components/AboutStorySection';
import { NoticesSection } from '@/pages/home/components/NoticesSection';
import { ContestsSection } from '@/pages/home/components/ContestsSection';
import { CollectionsSection } from '@/pages/home/components/CollectionsSection';
import { Footer } from '@/components/layout/Footer';
import { useEffect } from 'react';
import { setPageSEO } from '@/utils/seo';
import { ExhibitionsSection } from '@/pages/home/components/ExhibitionsSection';

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
        <AboutStorySection />
        <CollectionsSection />
        <ExhibitionsSection />
        <ContestsSection />
        <NoticesSection />      
      </main>
      <Footer />
    </div>
  );
}
