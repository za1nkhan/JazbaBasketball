'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Variant {
  id: string;
  size: string;
  active: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  active: boolean;
  badgeType: string | null;
  isPreorder: boolean;
  images: string[];
  variants: Variant[];
  _count: { orderItems: number };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/products');
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !currentActive }),
    });
    fetchProducts();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Deactivate "${name}"? It will be hidden from the shop.`)) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">{products.length} total</p>
          )}
        </div>
        <Link
          href="/admin/products/new"
          className="bg-brand-deep text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-deep/90 transition-colors"
        >
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 px-6">
            <p className="text-gray-500 mb-4">No products yet.</p>
            <Link
              href="/admin/products/new"
              className="text-brand-accent font-medium hover:underline"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Badge
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ${(product.priceCents / 100).toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Badge */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.isPreorder ? 'PRE-ORDER' : product.badgeType || '—'}
                  </td>

                  {/* Orders */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product._count.orderItems}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-sm text-brand-accent hover:underline"
                        aria-label={`Edit ${product.name}`}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleToggleActive(product.id, product.active)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                        aria-label={product.active ? `Deactivate ${product.name}` : `Activate ${product.name}`}
                      >
                        {product.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-sm text-red-500 hover:text-red-700"
                        aria-label={`Delete ${product.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
