'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  // Clear cart on mount
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // TODO: Optionally fetch order details using session_id search param

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="text-center max-w-lg">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mb-8">
          <svg
            className="w-10 h-10 text-brand-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-brand-deep mb-4">
          ORDER CONFIRMED
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 mb-2">
          Thank you for your order! We&apos;re getting your gear ready.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          A confirmation email has been sent to your email address.
        </p>

        {/* Order note for pre-orders */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-sm text-gray-500">
          <p>
            If your order includes pre-order items, they will ship by the
            estimated date shown on the product page.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-block bg-brand-deep text-white font-semibold px-8 py-3 rounded-lg hover:bg-brand-deep/90 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="inline-block border-2 border-brand-deep text-brand-deep font-semibold px-8 py-3 rounded-lg hover:bg-brand-deep hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
