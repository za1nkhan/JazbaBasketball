import Hero from '@/components/landing/Hero';
import SponsorStrip from '@/components/landing/SponsorStrip';
import Mission from '@/components/landing/Mission';
import Documentary from '@/components/landing/Documentary';
import Offerings from '@/components/landing/Offerings';
import SponsorShowcase from '@/components/landing/SponsorShowcase';
import ShopPreview from '@/components/landing/ShopPreview';
import Donation from '@/components/landing/Donation';
import Contact from '@/components/landing/Contact';
import prisma from '@/lib/prisma';

export default async function Home() {
  const showcaseSponsors = await prisma.sponsor.findMany({
    where: { active: true, showInShowcase: true },
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true, logoUrl: true, website: true },
  });

  return (
    <main id="main-content">
      <Hero />
      <SponsorStrip />
      <Mission />
      <Documentary />
      <Offerings />
      <SponsorShowcase sponsors={showcaseSponsors} />
      <ShopPreview />
      <Donation />
      <Contact />
    </main>
  );
}
