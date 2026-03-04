import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id: productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const body = await req.json();
  const { variants } = body;

  if (!Array.isArray(variants)) {
    return NextResponse.json({ error: 'variants must be an array' }, { status: 400 });
  }

  const sizes = variants.map((v: { size: string }) => v.size.toUpperCase().trim());
  const uniqueSizes = new Set(sizes);
  if (uniqueSizes.size !== sizes.length) {
    return NextResponse.json({ error: 'Duplicate sizes are not allowed' }, { status: 400 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const incomingIds = variants
      .filter((v: { id?: string }) => v.id)
      .map((v: { id: string }) => v.id);

    const variantsToRemove = product.variants.filter(
      (v) => !incomingIds.includes(v.id)
    );

    for (const v of variantsToRemove) {
      const orderItemCount = await tx.orderItem.count({
        where: { variantId: v.id },
      });

      if (orderItemCount > 0) {
        await tx.variant.update({
          where: { id: v.id },
          data: { active: false },
        });
      } else {
        await tx.variant.delete({
          where: { id: v.id },
        });
      }
    }

    for (const v of variants.filter((v: { id?: string }) => v.id)) {
      await tx.variant.update({
        where: { id: v.id },
        data: {
          size: v.size.toUpperCase().trim(),
          active: v.active,
        },
      });
    }

    for (const v of variants.filter((v: { id?: string }) => !v.id)) {
      await tx.variant.create({
        data: {
          productId,
          size: v.size.toUpperCase().trim(),
          active: v.active !== undefined ? v.active : true,
        },
      });
    }

    return tx.product.findUnique({
      where: { id: productId },
      include: { variants: { orderBy: { size: 'asc' } } },
    });
  });

  return NextResponse.json(result);
}
