'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoModal from './VideoModal';

// Drop images into public/images/hero/ named slide-1.jpg, slide-2.jpg, slide-3.jpg
// Supports .jpg .jpeg .png .webp — gradient shows as fallback when no image is present
const slides = [
  {
    image: '/images/hero/slide-1.jpg',
    fallback: 'linear-gradient(135deg, #133730 0%, #000000 100%)',
  },
  {
    image: '/images/hero/slide-2.jpg',
    fallback: 'linear-gradient(135deg, #0a1628 0%, #133730 50%, #000000 100%)',
  },
  {
    image: '/images/hero/slide-3.jpg',
    fallback: 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #133730 100%)',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToOfferings = () => {
    const el = document.getElementById('offerings');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section
        className="relative w-full h-screen overflow-hidden"
        role="region"
        aria-label="Hero image carousel"
        aria-roledescription="carousel"
      >
        {/* Carousel Slides — real photo on top, gradient fallback underneath */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            style={{
              backgroundImage: `url('${slide.image}'), ${slide.fallback}`,
            }}
          />
        ))}

        {/* Dark green hue overlay */}
        <div className="absolute inset-0 bg-brand-deep/60" />

        {/* Gradient Overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-start h-full text-center px-4 pt-24 md:pt-28">
          <img
            src="/images/logo/jazba-logo.png"
            alt="Jazba Basketball"
            className="h-40 md:h-48 w-auto mb-3 drop-shadow-2xl"
          />
          <span className="text-brand-accent text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Jazba Basketball
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white uppercase tracking-tight mb-4 leading-none">
            Elevate Your
            <br />
            Game
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mb-8">
            Where grit meets greatness. Toronto&apos;s premier basketball
            program.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <button
              onClick={scrollToOfferings}
              className="px-8 py-3 bg-white text-black font-semibold uppercase tracking-wide text-sm hover:bg-gray-100 transition-colors"
            >
              Explore The Program
            </button>
            <Link
              href="/shop"
              className="px-8 py-3 border border-white text-white font-semibold uppercase tracking-wide text-sm hover:bg-white/10 transition-colors"
            >
              Shop Jazba Gear
            </Link>
          </div>

          {/* Watch Film */}
          <button
            onClick={() => setModalOpen(true)}
            className="text-brand-accent font-medium text-sm tracking-wide hover:underline flex items-center gap-2"
          >
            <span>▶</span> Watch Film
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentSlide ? 'true' : undefined}
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-white w-6' : 'bg-white/40 w-2'
                  }`}
              />
            </button>
          ))}
        </div>
      </section>

      <VideoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
