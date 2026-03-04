import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: { variants: true, _count: { select: { orderItems: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, priceCents, images, isPreorder, preorderShipDate, badgeType } = body;

  if (!name || !description || !priceCents) {
    return NextResponse.json({ error: 'Name, description, and price are required' }, { status: 400 });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: 'A product with a similar name already exists' }, { status: 409 });
  }

  const defaultSizes = ['S', 'M', 'L', 'XL'];

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      priceCents: parseInt(priceCents, 10),
      currency: 'CAD',
      images: images || [],
      isPreorder: isPreorder || false,
      preorderShipDate: preorderShipDate ? new Date(preorderShipDate) : null,
      badgeType: badgeType || null,
      active: true,
      variants: {
        create: defaultSizes.map((size) => ({ size, active: true })),
      },
    },
    include: { variants: true },
  });

  return NextResponse.json(product, { status: 201 });
}
