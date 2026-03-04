import Link from 'next/link';

const previewProducts = [
  { name: 'Elite Hoodie', price: '$85.00 CAD', badge: 'PRE-ORDER' },
  { name: 'Courtside Tee', price: '$45.00 CAD', badge: 'NEW' },
  { name: 'Training Shorts', price: '$55.00 CAD', badge: 'PRE-ORDER' },
  { name: 'Snapback Cap', price: '$35.00 CAD', badge: 'NEW' },
];

const badgeStyles: Record<string, string> = {
  'PRE-ORDER': 'bg-brand-accent text-white',
  NEW: 'bg-black text-white',
  LIMITED: 'bg-red-600 text-white',
};

export default function ShopPreview() {
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
          {previewProducts.map((product) => (
            <div
              key={product.name}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Placeholder */}
              {/* TODO: Replace with product image */}
              <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3">
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  Product Image
                </div>
                {/* Badge */}
                <span
                  className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${
                    badgeStyles[product.badge] ?? 'bg-gray-500 text-white'
                  }`}
                >
                  {product.badge}
                </span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                {product.name}
              </p>
              <p className="text-gray-500 text-sm mt-1">{product.price}</p>
            </div>
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
