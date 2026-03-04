'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface VariantState {
  id?: string;
  size: string;
  active: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Product fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [isPreorder, setIsPreorder] = useState(false);
  const [preorderShipDate, setPreorderShipDate] = useState('');
  const [badgeType, setBadgeType] = useState('None');
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Image drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Variant state
  const [variants, setVariants] = useState<VariantState[]>([]);
  const [newSize, setNewSize] = useState('');
  const [variantsSaving, setVariantsSaving] = useState(false);
  const [variantsError, setVariantsError] = useState('');
  const [variantsSuccess, setVariantsSuccess] = useState('');

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setName(data.name);
        setSlug(data.slug);
        setDescription(data.description);
        setPrice((data.priceCents / 100).toFixed(2));
        setImages(data.images.length > 0 ? data.images : ['']);
        setIsPreorder(data.isPreorder);
        setPreorderShipDate(
          data.preorderShipDate
            ? new Date(data.preorderShipDate).toISOString().split('T')[0]
            : ''
        );
        setBadgeType(data.badgeType || 'None');
        setActive(data.active);
        if (data.variants) {
          setVariants(data.variants.map((v: VariantState) => ({ id: v.id, size: v.size, active: v.active })));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Image handlers
  const addImageField = () => setImages([...images, '']);
  const removeImageField = (index: number) => setImages(images.filter((_, i) => i !== index));
  const updateImage = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newImages = [...images];
    const [draggedItem] = newImages.splice(dragIndex, 1);
    newImages.splice(index, 0, draggedItem);
    setImages(newImages);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  // Variant handlers
  const toggleVariantActive = (index: number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, active: !v.active } : v))
    );
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    const size = newSize.toUpperCase().trim();
    if (!size) return;
    if (variants.some((v) => v.size === size)) {
      setVariantsError(`Size "${size}" already exists`);
      return;
    }
    setVariants([...variants, { size, active: true }]);
    setNewSize('');
    setVariantsError('');
  };

  const handleSaveVariants = async () => {
    setVariantsSaving(true);
    setVariantsError('');
    setVariantsSuccess('');

    const res = await fetch(`/api/admin/products/${id}/variants`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variants }),
    });

    const data = await res.json();
    setVariantsSaving(false);

    if (!res.ok) {
      setVariantsError(data.error || 'Failed to save variants');
      return;
    }

    setVariants(data.variants.map((v: VariantState) => ({ id: v.id, size: v.size, active: v.active })));
    setVariantsSuccess('Variants saved successfully');
    setTimeout(() => setVariantsSuccess(''), 3000);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Deactivate "${name}"? It will be hidden from the shop.`)) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    router.push('/admin/products');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSaveSuccess('');
    setSubmitting(true);

    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        slug,
        description,
        priceCents: Math.round(parseFloat(price) * 100),
        images: images.filter((img) => img.trim() !== ''),
        isPreorder,
        preorderShipDate: isPreorder ? preorderShipDate : null,
        badgeType: badgeType === 'None' ? null : badgeType,
        active,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || 'Failed to update product');
      return;
    }

    setSaveSuccess('Product saved successfully');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  if (loading) {
    return (
      <div className="max-w-2xl animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="bg-white rounded-xl p-6 space-y-4 border border-gray-100">
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-24 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Product not found.</p>
        <Link href="/admin/products" className="text-brand-accent hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">{name}</p>
        </div>
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Products
        </Link>
      </div>

      {/* ─── Product Details + Images + Pre-order (one form, one Save button) ─── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-base font-semibold text-gray-800">Product Details</h2>

          {/* Name */}
          <div>
            <label htmlFor="edit-product-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-product-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent text-sm"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="edit-product-slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              id="edit-product-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent text-sm"
            />
            <p className="text-xs text-amber-600 mt-1">
              Warning: Changing the slug will break existing links to this product.
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-product-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="edit-product-description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="edit-product-price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (CAD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true">$</span>
              <input
                id="edit-product-price"
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent text-sm"
              />
            </div>
          </div>

        </div>

        {/* ─── Images Card ─── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">Images</h2>
            <span className="text-xs text-gray-400">Drag to reorder · First image is primary</span>
          </div>

          <div className="space-y-2">
            {images.map((img, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing ${
                  dragIndex === index ? 'opacity-50' : ''
                }`}
              >
                {/* Drag handle */}
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                </svg>

                {/* Order number */}
                <span className="text-xs text-gray-400 w-5 flex-shrink-0">{index + 1}</span>

                {/* Preview */}
                {img && (img.startsWith('http') || img.startsWith('/')) && (
                  <div className="w-10 h-10 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}

                {/* URL input */}
                <input
                  type="url"
                  aria-label={`Image URL ${index + 1}`}
                  value={img}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  aria-label={`Remove image ${index + 1}`}
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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

        {/* ─── Pre-order & Badge Card ─── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-base font-semibold text-gray-800">Pre-order &amp; Badge</h2>

          {/* Badge */}
          <div>
            <label htmlFor="edit-product-badge" className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
            <select
              id="edit-product-badge"
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

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {saveSuccess && <p className="text-green-600 text-sm">{saveSuccess}</p>}

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
                Saving…
              </>
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </form>

      {/* ─── Variants Card ─── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">Variants</h2>

        {variants.length === 0 ? (
          <p className="text-sm text-gray-400">No variants yet. Add a size below.</p>
        ) : (
          <div className="space-y-2">
            {variants.map((v, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold w-12">{v.size}</span>
                  <button
                    type="button"
                    onClick={() => toggleVariantActive(index)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                      v.active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                  >
                    {v.active ? 'Active' : 'Inactive'}
                  </button>
                  {!v.id && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">New</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove size ${v.size}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add size */}
        <div className="flex gap-2">
          <input
            type="text"
            aria-label="New size to add"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addVariant())}
            placeholder="e.g., XXL, 2XL, YM"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 bg-brand-accent text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            Add
          </button>
        </div>

        {variantsError && <p className="text-red-500 text-sm">{variantsError}</p>}
        {variantsSuccess && <p className="text-green-600 text-sm">{variantsSuccess}</p>}

        <button
          type="button"
          onClick={handleSaveVariants}
          disabled={variantsSaving}
          className="bg-brand-deep text-white w-full py-3 rounded-lg font-semibold hover:bg-brand-deep/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {variantsSaving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : (
            'Save Variants'
          )}
        </button>
      </div>

      {/* ─── Danger Zone Card ─── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">Danger Zone</h2>

        {/* Active toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-accent transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <span className="text-sm font-medium text-gray-700">Active (visible in shop)</span>
        </label>

        <button
          type="button"
          onClick={handleDelete}
          className="w-full py-2.5 border border-red-300 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Deactivate Product
        </button>
      </div>
    </div>
  );
}
