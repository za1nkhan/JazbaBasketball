'use client';

import { useState, useCallback } from 'react';
import {
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCartStore } from '@/store/cart';

interface ExpressCheckoutProps {
  singleItem?: {
    productId: string;
    variantId: string;
    qty: number;
  };
}

export default function ExpressCheckout({ singleItem }: ExpressCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const items = useCartStore((s) => s.items);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkoutItems = singleItem
    ? [singleItem]
    : items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        qty: item.qty,
      }));

  const onConfirm = useCallback(async () => {
    if (!stripe || !elements) return;

    setErrorMessage(null);

    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: checkoutItems }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Checkout failed');
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Express checkout error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  }, [stripe, elements, checkoutItems]);

  return (
    <div className="w-full">
      <ExpressCheckoutElement
        onConfirm={onConfirm}
        options={{
          buttonType: {
            applePay: 'buy',
            googlePay: 'buy',
          },
          buttonTheme: {
            applePay: 'black',
            googlePay: 'black',
          },
          layout: {
            maxColumns: 2,
            maxRows: 1,
          },
        }}
        onClick={({ resolve }) => {
          resolve();
        }}
      />
      {errorMessage && (
        <p className="text-red-500 text-xs mt-2 text-center">{errorMessage}</p>
      )}
    </div>
  );
}
