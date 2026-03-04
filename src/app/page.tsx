import Hero from '@/components/landing/Hero';
import SponsorStrip from '@/components/landing/SponsorStrip';
import Mission from '@/components/landing/Mission';
import Documentary from '@/components/landing/Documentary';
import Offerings from '@/components/landing/Offerings';
import SponsorShowcase from '@/components/landing/SponsorShowcase';
import ShopPreview from '@/components/landing/ShopPreview';
import Donation from '@/components/landing/Donation';
import Contact from '@/components/landing/Contact';

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <SponsorStrip />
      <Mission />
      <Documentary />
      <Offerings />
      <SponsorShowcase />
      <ShopPreview />
      <Donation />
      <Contact />
    </main>
  );
}
