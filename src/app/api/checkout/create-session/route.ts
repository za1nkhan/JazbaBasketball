import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import stripe from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    // auth() may throw if AUTH_SECRET is not yet configured — treat as guest
    let userSession = null;
    try {
      userSession = await auth();
    } catch {
      // continue as guest checkout
    }
    const userId = userSession?.user?.id || null;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const lineItems: {
      price_data: {
        currency: string;
        product_data: {
          name: string;
          description?: string;
          images?: string[];
        };
        unit_amount: number;
      };
      quantity: number;
    }[] = [];

    const validatedItems: {
      productId: string;
      variantId: string;
      qty: number;
      unitPriceCents: number;
    }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId, active: true },
        include: { variants: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      const variant = product.variants.find(
        (v) => v.id === item.variantId && v.active
      );

      if (!variant) {
        return NextResponse.json(
          { error: `Invalid variant for ${product.name}: ${item.variantId}` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, Math.min(item.qty, 10));

      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: `${product.name} (${variant.size})`,
            description: product.description ?? undefined,
            images: product.images.filter((img) => img.startsWith('http')),
          },
          unit_amount: product.priceCents,
        },
        quantity: qty,
      });

      validatedItems.push({
        productId: product.id,
        variantId: variant.id,
        qty,
        unitPriceCents: product.priceCents,
      });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'cad' },
            display_name: 'Free Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
      ],
      ...(userSession?.user?.email ? { customer_email: userSession.user.email } : {}),
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      metadata: {
        items: JSON.stringify(validatedItems),
        ...(userId ? { userId } : {}),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
