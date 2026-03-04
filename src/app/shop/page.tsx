import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export const metadata = {
  title: 'Shop | Jazba Basketball',
  description: 'Official Jazba Basketball merchandise. Premium athletic streetwear.',
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main id="main-content" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-deep">SHOP</h1>
        <p className="text-gray-500 mt-2">Official Jazba Basketball merchandise</p>
      </div>

      {/* Product Grid */}
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
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No products available yet.</p>
          <p className="text-sm mt-2">Check back soon for new drops.</p>
        </div>
      )}
    </main>
  );
}
