import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export const metadata = {
  title: 'Shop | Jazba Basketball',
  description: 'Official Jazba Basketball merchandise. Premium athletic streetwear.',
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main id="main-content" className="min-h-screen">
      {/* Header — deep green */}
      <div className="bg-brand-deep pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase">
            Shop
          </h1>
          <p className="text-white/60 mt-3 text-sm tracking-wide uppercase">
            Official Jazba Basketball Merchandise
          </p>
        </div>
      </div>

      {/* Product Grid — light sage green */}
      <div className="bg-[#e8f2ec] py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  slug={product.slug}
                  priceCents={product.priceCents}
                  image={product.images[0] || null}
                  isPreorder={product.isPreorder}
                  badgeType={product.badgeType}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No products available yet.</p>
              <p className="text-sm mt-2">Check back soon for new drops.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
