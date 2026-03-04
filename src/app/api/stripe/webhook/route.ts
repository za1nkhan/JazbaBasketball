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
    console.error('Webhook error: No stripe-signature header');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Webhook error: STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const sessionId = session.id;

  const existingOrder = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
  });

  if (existingOrder) {
    console.log(`Order already exists for session ${sessionId}, skipping.`);
    return;
  }

  const itemsJson = session.metadata?.items;
  if (!itemsJson) {
    console.error(`No items metadata on session ${sessionId}`);
    return;
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
    console.error(`Failed to parse items metadata on session ${sessionId}`);
    return;
  }

  if (!cartItems || cartItems.length === 0) {
    console.error(`Empty cart items on session ${sessionId}`);
    return;
  }

  const email =
    session.customer_details?.email ||
    session.customer_email ||
    'unknown@checkout.stripe.com';

  const userId = session.metadata?.userId || null;

  const subtotalCents = cartItems.reduce(
    (sum, item) => sum + item.unitPriceCents * item.qty,
    0
  );

  try {
    const order = await prisma.order.create({
      data: {
        stripeSessionId: sessionId,
        email,
        userId,
        status: 'paid',
        subtotalCents,
        currency: 'CAD',
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

    console.log(
      `✅ Order created: ${order.id} (${order.items.length} items, $${(order.subtotalCents / 100).toFixed(2)} CAD)`
    );
  } catch (error) {
    console.error(`Failed to create order for session ${sessionId}:`, error);
  }
}
