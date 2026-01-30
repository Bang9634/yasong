import { Header } from '@/app/components/Header';
import { Hero } from '@/app/components/Hero';
import { Notice } from '@/app/components/Notice';
import { Contest } from '@/app/components/Contest';
import { DirectorIntro } from '@/app/components/DirectorIntro';
import { About } from '@/app/components/About';
import { Collections } from '@/app/components/Collections';
import { Exhibitions } from '@/app/components/Exhibitions';
import { Programs } from '@/app/components/Programs';
import { MuseumShop } from '@/app/components/MuseumShop';
import { VisitInfo } from '@/app/components/VisitInfo';
import { Location } from '@/app/components/Location';
import { Footer } from '@/app/components/Footer';
import { useEffect } from 'react';
import { setPageSEO } from '@/utils/seo';

export function HomePage() {
  useEffect(() => {
    setPageSEO({
      description: '군립청송야송미술관의 전시, 소장품, 프로그램, 기념품샵, 관람 안내 등 다양한 정보를 제공합니다.',
      keywords: '청송야송미술관, 청송미술관, 야송미술관, 청송군, 미술관, 전시, 소장품',
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Notice />
        <Contest />
        <DirectorIntro />
        <About />
        <Collections />
        <Exhibitions />
        <MuseumShop />
        <VisitInfo />
        <Location />
      </main>
      <Footer />
    </div>
  );
}
