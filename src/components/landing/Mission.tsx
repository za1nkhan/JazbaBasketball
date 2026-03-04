const pillars = [
  {
    icon: '🏀',
    title: 'Development',
    description:
      'Structured training to maximize individual athlete growth at every level.',
  },
  {
    icon: '🏆',
    title: 'Competition',
    description:
      'High-level AAU and grassroots competition that prepares athletes for the next stage.',
  },
  {
    icon: '🤝',
    title: 'Culture',
    description:
      'Building character, accountability, and brotherhood that extends beyond the court.',
  },
];

export default function Mission() {
  return (
    <section id="mission" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div>
            <span className="text-brand-accent text-sm font-semibold tracking-[0.3em] uppercase block mb-4">
              Our Mission
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-deep uppercase leading-tight mb-6">
              More Than
              <br />A Team.
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Jazba Basketball is a movement rooted in Toronto&apos;s basketball
              culture. We develop elite athletes through structured programs,
              competitive play, and a culture of accountability.
            </p>
          </div>

          {/* Right Column: Pillar Cards */}
          <div className="flex flex-col gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-start gap-4 p-6 border-l-4 border-brand-accent bg-gray-50 rounded-r-lg"
              >
                <span className="text-3xl">{pillar.icon}</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-500">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
