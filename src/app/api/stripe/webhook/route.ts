import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let event: Stripe.Event;

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const result = await handleCheckoutCompleted(session);
    return NextResponse.json({ received: true, event: event.type, result }, { status: 200 });
  }

  return NextResponse.json({ received: true, event: event.type, result: 'unhandled' }, { status: 200 });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<string> {
  const sessionId = session.id;

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (existingOrder) {
      return `duplicate: order ${existingOrder.id} already exists`;
    }

    const itemsJson = session.metadata?.items;
    if (!itemsJson) {
      return `error: no items metadata on session ${sessionId}`;
    }

    let cartItems: {
      productId: string;
      variantId: string;
      qty: number;
      unitPriceCents: number;
    }[];

    try {
      cartItems = JSON.parse(itemsJson);
    } catch {
      return `error: failed to parse items metadata`;
    }

    if (!cartItems || cartItems.length === 0) {
      return `error: empty cart items`;
    }

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      'unknown@checkout.stripe.com';

    const metadataUserId = session.metadata?.userId || null;

    // Verify user exists before connecting (handles stale JWTs / DB resets)
    let userId: string | null = null;
    if (metadataUserId) {
      const user = await prisma.user.findUnique({ where: { id: metadataUserId } });
      userId = user ? metadataUserId : null;
    }

    // Retrieve full session to get shipping details (under collected_information in API v2026+)
    const fullSession = await stripe.checkout.sessions.retrieve(sessionId);
    const collected = (fullSession as unknown as {
      collected_information?: {
        shipping_details?: { name?: string; address?: Stripe.Address } | null;
      } | null;
    }).collected_information;
    const shipping = collected?.shipping_details;

    const subtotalCents = cartItems.reduce(
      (sum, item) => sum + item.unitPriceCents * item.qty,
      0
    );

    const order = await prisma.order.create({
      data: {
        stripeSessionId: sessionId,
        email,
        ...(userId ? { user: { connect: { id: userId } } } : {}),
        status: 'paid',
        subtotalCents,
        currency: 'CAD',
        shippingName: shipping?.name || null,
        shippingLine1: shipping?.address?.line1 || null,
        shippingLine2: shipping?.address?.line2 || null,
        shippingCity: shipping?.address?.city || null,
        shippingProvince: shipping?.address?.state || null,
        shippingPostalCode: shipping?.address?.postal_code || null,
        shippingCountry: shipping?.address?.country || null,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            qty: item.qty,
            unitPriceCents: item.unitPriceCents,
          })),
        },
      },
      include: { items: true },
    });

    return `success: order ${order.id} created (${order.items.length} items, $${(order.subtotalCents / 100).toFixed(2)} CAD)`;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return `error: ${message}`;
  }
}
