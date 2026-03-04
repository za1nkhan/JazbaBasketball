'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [isPreorder, setIsPreorder] = useState(false);
  const [preorderShipDate, setPreorderShipDate] = useState('');
  const [badgeType, setBadgeType] = useState('None');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addImageField = () => setImages([...images, '']);
  const removeImageField = (index: number) => setImages(images.filter((_, i) => i !== index));
  const updateImage = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        priceCents: Math.round(parseFloat(price) * 100),
        images: images.filter((img) => img.trim() !== ''),
        isPreorder,
        preorderShipDate: isPreorder ? preorderShipDate : null,
        badgeType: badgeType === 'None' ? null : badgeType,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Failed to create product');
      setSubmitting(false);
      return;
    }

    router.push('/admin/products');
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
        <Link
          href="/admin/products"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="new-product-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="new-product-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(generateSlug(e.target.value));
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent text-sm"
              placeholder="Jazba Classic Hoodie"
            />
          </div>

          {/* Slug (auto-generated, readonly) */}
          <div>
            <label htmlFor="new-product-slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-gray-400 font-normal">(auto-generated)</span>
            </label>
            <input
              id="new-product-slug"
              type="text"
              readOnly
              value={slug}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 cursor-default"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="new-product-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="new-product-description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent text-sm resize-none"
              placeholder="Describe the product..."
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="new-product-price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (CAD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true">$</span>
              <input
                id="new-product-price"
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent text-sm"
                placeholder="85.00"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images (URLs)
            </label>
            <div className="space-y-2">
              {images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    aria-label={`Image URL ${index + 1}`}
                    value={img}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      aria-label={`Remove image ${index + 1}`}
                      className="px-3 text-red-400 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-sm text-brand-accent hover:underline font-medium"
              >
                + Add another image
              </button>
            </div>
          </div>

          {/* Badge Type */}
          <div>
            <label htmlFor="new-product-badge" className="block text-sm font-medium text-gray-700 mb-1">
              Badge
            </label>
            <select
              id="new-product-badge"
              value={badgeType}
              onChange={(e) => setBadgeType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent text-sm bg-white"
            >
              <option value="None">None</option>
              <option value="NEW">NEW</option>
              <option value="LIMITED">LIMITED</option>
            </select>
          </div>

          {/* Pre-order toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isPreorder}
                  onChange={(e) => setIsPreorder(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-accent transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">Pre-order</span>
            </label>
          </div>

          {/* Pre-order ship date */}
          {isPreorder && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Ship Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required={isPreorder}
                value={preorderShipDate}
                onChange={(e) => setPreorderShipDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent text-sm"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="bg-brand-deep text-white w-full py-3 rounded-lg font-semibold hover:bg-brand-deep/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating…
              </>
            ) : (
              'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
