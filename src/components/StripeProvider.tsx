'use client';

import { ReactNode, useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe-client';

interface StripeProviderProps {
  children: ReactNode;
  amount: number; // amount in cents for display
}

export default function StripeProvider({ children, amount }: StripeProviderProps) {
  const stripePromise = useMemo(() => getStripe(), []);

  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? '';
  // Bail out if key is missing or is the placeholder value
  const isRealKey = (key.startsWith('pk_test_') || key.startsWith('pk_live_')) && key.length > 30;
  if (!isRealKey) {
    return <>{children}</>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: 'payment',
        amount: Math.max(amount, 50),
        currency: 'cad',
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#133730',
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
