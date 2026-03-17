'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
}

interface SponsorShowcaseProps {
  sponsors: Sponsor[];
}

export default function SponsorShowcase({ sponsors }: SponsorShowcaseProps) {
  const router = useRouter();

  const handleBecomeSponsor = () => {
    router.push('/?type=sponsor#contact');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="sponsors" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 uppercase mb-12">
          Our Sponsors &amp; Partners
        </h2>

        {/* Logo Grid */}
        {sponsors.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-8 mb-12">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="h-16 bg-white rounded-lg border border-gray-100 shadow-sm flex items-center justify-center p-3"
              >
                {sponsor.website ? (
                  <a href={sponsor.website} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>
                    <Image
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      width={120}
                      height={48}
                      className="object-contain max-h-10 w-auto"
                      unoptimized
                    />
                  </a>
                ) : (
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    width={120}
                    height={48}
                    className="object-contain max-h-10 w-auto"
                    unoptimized
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-8 mb-12">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 font-medium"
              >
                Partner {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleBecomeSponsor}
            className="px-8 py-4 bg-brand-accent text-white font-semibold uppercase tracking-wide text-sm hover:bg-green-700 transition-colors rounded-lg"
          >
            Become A Sponsor
          </button>
        </div>
      </div>
    </section>
  );
}
