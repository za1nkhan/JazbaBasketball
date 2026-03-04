const sponsors = [
  'Sponsor 1',
  'Sponsor 2',
  'Sponsor 3',
  'Sponsor 4',
  'Sponsor 5',
  'Sponsor 6',
];

export default function SponsorStrip() {
  return (
    <section className="bg-gray-100 py-6 overflow-hidden">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-4">
        Proudly Supported By
      </p>
      {/* TODO: Replace with real sponsor logos */}
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee">
          {sponsors.map((name, i) => (
            <div
              key={i}
              className="w-24 h-10 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500 font-medium mx-6"
            >
              {name}
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {sponsors.map((name, i) => (
            <div
              key={`d-${i}`}
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
