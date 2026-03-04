'use client';

interface SizeSelectorProps {
  variants: { id: string; size: string; active: boolean }[];
  selectedVariantId: string | null;
  onSelect: (variantId: string, size: string) => void;
}

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

export default function SizeSelector({
  variants,
  selectedVariantId,
  onSelect,
}: SizeSelectorProps) {
  const sorted = [...variants].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.size);
    const bi = SIZE_ORDER.indexOf(b.size);
    if (ai === -1 && bi === -1) return a.size.localeCompare(b.size);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map((variant) => (
        <button
          key={variant.id}
          onClick={() => variant.active && onSelect(variant.id, variant.size)}
          disabled={!variant.active}
          className={`border-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors
            ${!variant.active ? 'opacity-30 cursor-not-allowed line-through border-gray-300 text-gray-900' : ''}
            ${variant.active && selectedVariantId === variant.id
              ? 'bg-brand-deep text-white border-brand-deep'
              : variant.active
              ? 'bg-white text-gray-900 border-gray-300 hover:border-brand-deep'
              : ''
            }
          `}
        >
          {variant.size}
        </button>
      ))}
    </div>
  );
}
