import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  name: string;
  slug: string;
  priceCents: number;
  image: string | null;
  isPreorder: boolean;
  badgeType: string | null;
}

export default function ProductCard({
  name,
  slug,
  priceCents,
  image,
  isPreorder,
  badgeType,
}: ProductCardProps) {
  const badgeContent = isPreorder
    ? { label: 'PRE-ORDER', className: 'bg-brand-accent text-white' }
    : badgeType === 'NEW'
    ? { label: 'NEW', className: 'bg-black text-white' }
    : badgeType === 'LIMITED'
    ? { label: 'LIMITED', className: 'bg-red-600 text-white' }
    : null;

  const hasValidImage = image && (image.startsWith('/') || image.startsWith('http'));

  return (
    <Link href={`/shop/${slug}`} className="group block">
      {/* Image area */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
        {hasValidImage ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        )}

        {/* Badge */}
        {badgeContent && (
          <span
            className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${badgeContent.className}`}
          >
            {badgeContent.label}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-3">
        <p className="font-semibold text-sm text-gray-900 truncate">{name}</p>
        <p className="text-gray-500 text-sm mt-0.5">
          ${(priceCents / 100).toFixed(2)} CAD
        </p>
      </div>
    </Link>
  );
}
