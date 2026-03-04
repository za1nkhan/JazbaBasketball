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

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
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
