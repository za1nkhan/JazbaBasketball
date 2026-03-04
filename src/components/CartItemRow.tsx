'use client';

import Image from 'next/image';
import { CartItem } from '@/types/cart';
import { useCartStore } from '@/store/cart';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQty, removeItem } = useCartStore();

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded bg-gray-200 flex-shrink-0 relative overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
        <span className="inline-block bg-gray-100 text-xs px-2 py-0.5 rounded mt-0.5">
          {item.size}
        </span>
        <p className="text-sm text-gray-600 mt-0.5">
          ${(item.priceCents / 100).toFixed(2)}
        </p>

        {/* Qty Stepper */}
        <div className="flex items-center gap-1 mt-2">
          <button
            onClick={() => updateQty(item.productId, item.variantId, item.qty - 1)}
            className="min-w-[44px] min-h-[44px] rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500 transition-colors"
            aria-label={`Decrease quantity of ${item.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-sm w-8 text-center">{item.qty}</span>
          <button
            onClick={() => updateQty(item.productId, item.variantId, item.qty + 1)}
            disabled={item.qty >= 10}
            className="min-w-[44px] min-h-[44px] rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={`Increase quantity of ${item.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.productId, item.variantId)}
        className="text-gray-400 hover:text-red-500 transition-colors self-start mt-0.5 flex-shrink-0 p-1"
        aria-label={`Remove ${item.name} from cart`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
