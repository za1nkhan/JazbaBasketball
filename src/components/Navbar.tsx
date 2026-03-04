'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cart';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.itemCount());
  const isHydrated = useCartStore((s) => s.isHydrated);
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || pathname === '/account'
            ? 'bg-brand-deep shadow-lg'
            : 'bg-transparent hover:bg-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="text-white font-bold text-2xl tracking-widest uppercase"
            >
              JAZBA
            </Link>

            {/* Desktop Nav */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-white text-sm font-medium tracking-wide uppercase hover:text-brand-accent transition-colors"
              >
                Home
              </Link>
              <button
                onClick={() => scrollToSection('offerings')}
                className="text-white text-sm font-medium tracking-wide uppercase hover:text-brand-accent transition-colors cursor-pointer"
              >
                Program
              </button>
              <Link
                href="/shop"
                className="text-white text-sm font-medium tracking-wide uppercase hover:text-brand-accent transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/account"
                className="text-white text-sm font-medium tracking-wide uppercase hover:text-brand-accent transition-colors"
              >
                {session?.user ? (
                  <span className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-sm font-bold">
                    {session.user.email?.[0]?.toUpperCase()}
                  </span>
                ) : (
                  'Account'
                )}
              </Link>
            </nav>

            {/* Right: Cart + Hamburger */}
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <button
                onClick={toggleCart}
                className="relative text-white hover:text-brand-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={isHydrated && itemCount > 0 ? `Shopping cart, ${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Shopping cart'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                  />
                </svg>
                {isHydrated && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Hamburger (mobile only) */}
              <button
                className="md:hidden text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={() => setMenuOpen(true)}
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={menuOpen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-in Menu */}
      <div
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-72 bg-brand-deep z-50 transform transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <span className="text-white font-bold text-xl tracking-widest">JAZBA</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="flex flex-col p-6 gap-2">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-white text-lg font-medium tracking-wide uppercase hover:text-brand-accent transition-colors py-3"
          >
            Home
          </Link>
          <button
            onClick={() => scrollToSection('offerings')}
            className="text-left text-white text-lg font-medium tracking-wide uppercase hover:text-brand-accent transition-colors py-3"
          >
            Program
          </button>
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="text-white text-lg font-medium tracking-wide uppercase hover:text-brand-accent transition-colors py-3"
          >
            Shop
          </Link>
          <Link
            href="/account"
            onClick={() => setMenuOpen(false)}
            className="text-white text-lg font-medium tracking-wide uppercase hover:text-brand-accent transition-colors py-3"
          >
            Account
          </Link>
        </nav>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
