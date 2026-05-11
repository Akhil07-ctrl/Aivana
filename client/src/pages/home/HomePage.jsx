import PageWrapper from '../../components/layout/PageWrapper';
import HeroSection from '../../components/home/HeroSection';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import CategoryGrid from '../../components/home/CategoryGrid';
import BrandPerks from '../../components/home/BrandPerks';
import DownloadApp from '../../components/home/DownloadApp';
import StyleGallery from '../../components/home/StyleGallery';
import Testimonials from '../../components/home/Testimonials';
import Newsletter from '../../components/home/Newsletter';
import EleganceSection from '../../components/home/EleganceSection';

export default function HomePage() {
  return (
    <PageWrapper>
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <CategoryGrid />
        <BrandPerks />
        <StyleGallery />
        <Testimonials />
        <DownloadApp />
        <Newsletter />

        {/* Cinematic Scroll-Reveal CTA */}
        <EleganceSection />

      </main>
    </PageWrapper>
  );
}
