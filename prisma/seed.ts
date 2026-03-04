import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const sizes = ['S', 'M', 'L', 'XL'];

  const products = [
    {
      name: 'Jazba Elite Hoodie',
      slug: 'jazba-elite-hoodie',
      description: 'Premium heavyweight hoodie with embroidered Jazba crest. Built for warmth on and off the court.',
      priceCents: 8500,
      images: ['/images/products/hoodie-placeholder.jpg'], // TODO: Replace with real product images
      isPreorder: true,
      preorderShipDate: new Date('2026-05-15'),
      badgeType: null, // PRE-ORDER derived from isPreorder
    },
    {
      name: 'Jazba Courtside Tee',
      slug: 'jazba-courtside-tee',
      description: 'Relaxed-fit cotton tee with screen-printed Jazba logo. Streetwear meets sport.',
      priceCents: 4500,
      images: ['/images/products/tee-placeholder.jpg'], // TODO: Replace with real product images
      isPreorder: false,
      badgeType: 'NEW',
    },
    {
      name: 'Jazba Training Shorts',
      slug: 'jazba-training-shorts',
      description: 'Lightweight mesh shorts with zip pockets. Designed for maximum mobility during training.',
      priceCents: 5500,
      images: ['/images/products/shorts-placeholder.jpg'], // TODO: Replace with real product images
      isPreorder: true,
      preorderShipDate: new Date('2026-06-01'),
      badgeType: null,
    },
    {
      name: 'Jazba Snapback Cap',
      slug: 'jazba-snapback-cap',
      description: 'Structured snapback with raised Jazba embroidery. One size fits most.',
      priceCents: 3500,
      images: ['/images/products/cap-placeholder.jpg'], // TODO: Replace with real product images
      isPreorder: false,
      badgeType: 'NEW',
    },
    {
      name: 'Jazba Warm-Up Joggers',
      slug: 'jazba-warmup-joggers',
      description: 'Tapered joggers with ribbed cuffs and Jazba branding. Pre-game essential.',
      priceCents: 7000,
      images: ['/images/products/joggers-placeholder.jpg'], // TODO: Replace with real product images
      isPreorder: true,
      preorderShipDate: new Date('2026-05-15'),
      badgeType: null,
    },
    {
      name: 'Jazba Duffle Bag',
      slug: 'jazba-duffle-bag',
      description: 'Oversized duffle with shoe compartment and Jazba woven patch. Gym to street.',
      priceCents: 6500,
      images: ['/images/products/duffle-placeholder.jpg'], // TODO: Replace with real product images
      isPreorder: false,
      badgeType: 'LIMITED',
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        ...product,
        currency: 'CAD',
        active: true,
        variants: {
          create: sizes.map((size) => ({
            size,
            active: true,
          })),
        },
      },
    });
    console.log(`Created product: ${created.name} (${created.slug})`);
  }

  console.log('Seed complete: 6 products, 24 variants.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
