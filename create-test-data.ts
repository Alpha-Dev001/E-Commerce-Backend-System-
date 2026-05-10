import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestData() {
  console.log('Creating test products...');

  // Create test products
  const laptop = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Laptop',
      price: 999.99,
      description: 'A powerful laptop',
      stock: 10,
    },
  });

  const mouse = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Mouse',
      price: 29.99,
      description: 'A wireless mouse',
      stock: 50,
    },
  });

  console.log('Created products:', laptop, mouse);

  // Get user and create cart
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (user) {
    // Create cart for user
    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
      },
    });

    // Add items to cart
    const existingCartItem1 = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: 1 },
    });

    if (existingCartItem1) {
      await prisma.cartItem.update({
        where: { id: existingCartItem1.id },
        data: { quantity: 2 },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: 1,
          quantity: 2,
        },
      });
    }

    const existingCartItem2 = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: 2 },
    });

    if (existingCartItem2) {
      await prisma.cartItem.update({
        where: { id: existingCartItem2.id },
        data: { quantity: 1 },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: 2,
          quantity: 1,
        },
      });
    }

    console.log('Created cart with items for user:', user.email);
  }

  console.log('Test data creation completed!');
}

createTestData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
