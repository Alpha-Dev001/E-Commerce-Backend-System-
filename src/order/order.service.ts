import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}
    
    async checkout(userId: number) {
  const cart = await this.prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  const total = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const order = await this.prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  await this.prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return order;
}
}
