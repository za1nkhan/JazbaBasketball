import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;
  const sort = searchParams.get('sort') || 'newest';

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { id: { contains: search } },
      { shippingName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [orders, total, paidCount, fulfilledCount, canceledCount, revenueResult] =
    await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: true, variant: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: sort === 'oldest' ? 'asc' : 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
      prisma.order.count({ where: { status: 'paid' } }),
      prisma.order.count({ where: { status: 'fulfilled' } }),
      prisma.order.count({ where: { status: 'canceled' } }),
      prisma.order.aggregate({
        where: { status: { in: ['paid', 'fulfilled'] } },
        _sum: { subtotalCents: true },
      }),
    ]);

  return NextResponse.json({
    orders,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    summary: {
      total: paidCount + fulfilledCount + canceledCount,
      paid: paidCount,
      fulfilled: fulfilledCount,
      canceled: canceledCount,
      revenueCents: revenueResult._sum.subtotalCents || 0,
    },
  });
}
