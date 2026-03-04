export default function Donation() {
  return (
    <section className="bg-brand-deep text-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold uppercase mb-6">
          Support The Movement
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          Every dollar helps us provide opportunities for young athletes across
          Toronto. Your donation funds equipment, gym time, tournament fees, and
          mentorship.
        </p>
        {/* TODO: Set NEXT_PUBLIC_GOFUNDME_URL in .env */}
        <a
          href={process.env.NEXT_PUBLIC_GOFUNDME_URL || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-4 bg-brand-accent hover:bg-green-700 text-white font-semibold uppercase tracking-wide text-sm transition-colors rounded-lg"
        >
          Donate via GoFundMe
        </a>
      </div>
    </section>
  );
}
