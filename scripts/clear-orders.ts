import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearOrders() {
  console.log('Clearing all orders...');

  // Delete OrderItems first (foreign key constraint)
  const deletedItems = await prisma.orderItem.deleteMany();
  console.log(`  Deleted ${deletedItems.count} order items`);

  // Then delete Orders
  const deletedOrders = await prisma.order.deleteMany();
  console.log(`  Deleted ${deletedOrders.count} orders`);

  console.log('✅ Order history cleared');
}

clearOrders()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
