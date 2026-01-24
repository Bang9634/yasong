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

export function HomePage() {
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
