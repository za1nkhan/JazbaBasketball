import prisma from '@/lib/prisma';
import Image from 'next/image';

export default async function SponsorStrip() {
  const sponsors = await prisma.sponsor.findMany({
    where: { active: true, showInStrip: true },
    orderBy: { displayOrder: 'asc' },
  });

  // Fall back to placeholder tiles if no sponsors are configured yet
  if (sponsors.length === 0) {
    const placeholders = ['Sponsor 1', 'Sponsor 2', 'Sponsor 3', 'Sponsor 4', 'Sponsor 5', 'Sponsor 6'];
    return (
      <section className="bg-gray-100 py-6 overflow-hidden">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-4">
          Proudly Supported By
        </p>
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee">
            {[...placeholders, ...placeholders].map((name, i) => (
              <div
                key={i}
                className="w-24 h-10 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500 font-medium mx-6"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Repeat sponsors until we have at least 8, then duplicate for seamless loop
  const minItems = 8;
  const repeatCount = Math.ceil(minItems / sponsors.length);
  const base = Array.from({ length: repeatCount }, () => sponsors).flat();
  const items = [...base, ...base];

  return (
    <section className="bg-gray-100 py-6 overflow-hidden">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-4">
        Proudly Supported By
      </p>
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee">
          {items.map((sponsor, i) => (
            <div key={i} className="mx-6 flex items-center justify-center">
              {sponsor.website ? (
                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    width={96}
                    height={40}
                    className="h-10 w-24 object-contain"
                    unoptimized
                  />
                </a>
              ) : (
                <Image
                  src={sponsor.logoUrl}
                  alt={sponsor.name}
                  width={96}
                  height={40}
                  className="h-10 w-24 object-contain"
                  unoptimized
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
