import { Prisma } from '@prisma/client';
import prisma from './prisma';

export type ProductWithVariants = Prisma.ProductGetPayload<{
  include: { variants: true };
}>;

/**
 * Fetch all active products with their active variants.
 * Used on /shop listing page.
 */
export async function getProducts() {
  return prisma.product.findMany({
    where: { active: true },
    include: {
      variants: {
        where: { active: true },
        orderBy: { size: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Fetch a single product by slug, including active variants.
 * Returns null if not found or inactive.
 * Used on /shop/[slug] detail page.
 */
export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, active: true },
    include: {
      variants: {
        where: { active: true },
        orderBy: { size: 'asc' },
      },
    },
  });
}

/**
 * Fetch first N active products for the landing page shop preview.
 * Defaults to 4 products.
 */
export async function getFeaturedProducts(limit: number = 4) {
  return prisma.product.findMany({
    where: { active: true },
    include: {
      variants: {
        where: { active: true },
        orderBy: { size: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Fetch a product by ID with variants (including inactive).
 * Used in admin and checkout validation.
 */
export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
    },
  });
}
