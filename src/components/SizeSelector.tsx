'use client';

interface SizeSelectorProps {
  variants: { id: string; size: string; active: boolean }[];
  selectedVariantId: string | null;
  onSelect: (variantId: string, size: string) => void;
}

export default function SizeSelector({
  variants,
  selectedVariantId,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
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
