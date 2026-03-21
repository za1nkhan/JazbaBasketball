'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductWithVariants } from '@/lib/products';
import { useCartStore } from '@/store/cart';
import SizeSelector from '@/components/SizeSelector';

interface ProductDetailProps {
  product: ProductWithVariants;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const { addItem, openCart } = useCartStore();

  const handleSizeSelect = (variantId: string, size: string) => {
    setSelectedVariantId(variantId);
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!selectedVariantId || !selectedSize) return;
    addItem({
      productId: product.id,
      variantId: selectedVariantId,
      name: product.name,
      size: selectedSize,
      priceCents: product.priceCents,
      image: product.images[0] || '',
      qty: 1,
    });
    openCart();
  };

  const mainImage = product.images[mainImageIndex] || null;
  const hasMainImage = mainImage && (mainImage.startsWith('/') || mainImage.startsWith('http'));

  const isComingSoon = product.badgeType === 'COMING_SOON';

  const badgeContent = product.isPreorder
    ? { label: 'PRE-ORDER', className: 'bg-brand-accent text-white' }
    : product.badgeType === 'NEW'
    ? { label: 'NEW', className: 'bg-black text-white' }
    : product.badgeType === 'LIMITED'
    ? { label: 'LIMITED', className: 'bg-red-600 text-white' }
    : isComingSoon
    ? { label: 'COMING SOON', className: 'bg-gray-700 text-white' }
    : null;

  return (
    <main id="main-content" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back to Shop */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-deep transition-colors mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Shop
      </Link>

      <div className="md:grid md:grid-cols-2 gap-12">
        {/* Left — Image */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
            {hasMainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            )}

            {/* Badge */}
            {badgeContent && (
              <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded ${badgeContent.className}`}>
                {badgeContent.label}
              </span>
            )}
          </div>

          {/* Thumbnail row */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImageIndex(idx)}
                  aria-label={`View image ${idx + 1} of ${product.images.length}`}
                  aria-pressed={idx === mainImageIndex}
                  className={`w-16 h-16 rounded-lg bg-gray-100 overflow-hidden relative border-2 transition-colors ${
                    idx === mainImageIndex ? 'border-brand-deep' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Info */}
        <div className="mt-8 md:mt-0">
          <h1 className="text-3xl font-bold text-brand-deep">{product.name}</h1>
          <p className="text-2xl font-semibold mt-2 text-gray-900">
            ${(product.priceCents / 100).toFixed(2)} CAD
          </p>

          {/* Pre-order banner */}
          {product.isPreorder && (
            <div className="bg-brand-accent/10 border border-brand-accent rounded-lg p-4 mt-4">
              <p className="text-brand-accent font-semibold">📦 Pre-order</p>
              <p className="text-sm text-gray-600">
                Estimated shipping:{' '}
                {product.preorderShipDate
                  ? new Date(product.preorderShipDate).toLocaleDateString('en-CA', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'TBA'}
              </p>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="text-gray-600 mt-6 leading-relaxed space-y-4">
              {product.description.split(/\n\n+/).map((para, i) => (
                <p key={i}>
                  {para.split('\n').map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          )}

          <hr className="border-t my-6" />

          {/* Size Selector */}
          {!isComingSoon && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Select Size</p>
              <SizeSelector
                variants={product.variants}
                selectedVariantId={selectedVariantId}
                onSelect={handleSizeSelect}
              />
            </div>
          )}

          {/* Add to Cart */}
          {isComingSoon ? (
            <div className="w-full py-4 text-lg font-bold rounded-lg bg-gray-100 text-gray-400 text-center cursor-not-allowed select-none">
              Coming Soon
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariantId}
              className={`w-full py-4 text-lg font-bold rounded-lg transition-colors ${
                selectedVariantId
                  ? 'bg-brand-deep text-white hover:bg-brand-deep/90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {product.isPreorder ? 'Pre-order Now' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
