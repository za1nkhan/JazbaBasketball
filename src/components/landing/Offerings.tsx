import Image from 'next/image';

const programs = [
  {
    title: 'AAU / Grassroots',
    description:
      'Competitive AAU teams for U13–U17 athletes. Season runs spring through summer.',
    image: '/images/offerings/aau-grassroots.jpg',
    alt: 'Jazba Basketball AAU team posing together on the court',
  },
  {
    title: 'Tournaments',
    description:
      'Jazba-hosted tournaments and invitational events across the GTA.',
    image: '/images/offerings/tournaments.jpg',
    alt: 'Jazba Basketball team huddle during a tournament',
  },
  {
    title: 'Training & Development',
    description:
      'Year-round skill development sessions, clinics, and mentorship.',
    image: '/images/offerings/training-development.jpg',
    alt: 'Jazba Basketball athletes lined up during a training session',
  },
];

export default function Offerings() {
  return (
    <section id="offerings" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-accent text-sm font-semibold tracking-[0.3em] uppercase block mb-3">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase">
            Programs Built For Hoopers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div
              key={program.title}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
            >
              {/* Program Image */}
              <div className="aspect-[4/3] relative">
                <Image
                  src={program.image}
                  alt={program.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {program.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {program.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
