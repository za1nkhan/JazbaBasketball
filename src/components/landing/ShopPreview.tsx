import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/products';

const badgeStyles: Record<string, string> = {
  'PRE-ORDER': 'bg-brand-accent text-white',
  NEW: 'bg-black text-white',
  LIMITED: 'bg-red-600 text-white',
};

export default async function ShopPreview() {
  const products = await getFeaturedProducts(4);

  return (
    <section id="shop-preview" className="bg-white border-t border-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 uppercase mb-3">
            Jazba Gear
          </h2>
          <p className="text-gray-500">
            Rep the brand. Limited drops, premium quality.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Product Image
                  </div>
                )}
                {(product.isPreorder || product.badgeType) && (
                  <span
                    className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${
                      badgeStyles[product.isPreorder ? 'PRE-ORDER' : product.badgeType!] ?? 'bg-gray-500 text-white'
                    }`}
                  >
                    {product.isPreorder ? 'PRE-ORDER' : product.badgeType}
                  </span>
                )}
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                {product.name}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                ${(product.priceCents / 100).toFixed(2)} CAD
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="text-brand-accent font-semibold hover:underline inline-flex items-center gap-1"
          >
            View Full Shop →
          </Link>
        </div>
      </div>
    </section>
  );
}
