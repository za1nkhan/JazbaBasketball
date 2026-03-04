'use client';

import { useRouter } from 'next/navigation';

const sponsors = Array.from({ length: 10 }, (_, i) => `Partner ${i + 1}`);

export default function SponsorShowcase() {
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
        {/* TODO: Replace with real sponsor logos */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-8 mb-12">
          {sponsors.map((name) => (
            <div
              key={name}
              className="h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 font-medium"
            >
              {name}
            </div>
          ))}
        </div>

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
