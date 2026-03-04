export default function Documentary() {
  return (
    <section id="documentary" className="bg-brand-deep text-white py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-brand-accent text-sm font-semibold tracking-[0.3em] uppercase block mb-4">
          The Film
        </span>
        <h2 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4">
          This Is Jazba.
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
          A look inside the heart of Toronto&apos;s hardest-working basketball
          program.
        </p>
        <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src="https://www.youtube.com/embed/EPId6zBtsks"
            title="Jazba Basketball Documentary"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
