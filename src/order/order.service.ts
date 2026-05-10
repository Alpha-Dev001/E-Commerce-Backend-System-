import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from './types/order-status.enum';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  private readonly statusTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.REFUNDED],
    [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.REFUNDED]: [],
  };

  async checkout(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    // Check if all products have sufficient stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`);
      }
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Create order and reduce stock in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
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

      // Reduce stock for each product
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });

    return result;
  }

  async updateOrderStatus(orderId: number, newStatus: OrderStatus): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (!this.isValidStatusTransition(order.status as OrderStatus, newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${newStatus}`
      );
    }

    const updateData: any = { status: newStatus };

    if (newStatus === OrderStatus.SHIPPED) {
      updateData.shippedAt = new Date();
    } else if (newStatus === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    return await this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });
  }

  async getOrderById(orderId: number): Promise<any> {
    return await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getUserOrders(userId: number): Promise<any[]> {
    return await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllOrders(): Promise<any[]> {
    return await this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getOrdersByStatus(status: OrderStatus): Promise<any[]> {
    return await this.prisma.order.findMany({
      where: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const allowedTransitions = this.statusTransitions[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  async cancelOrder(orderId: number): Promise<any> {
    const order = await this.getOrderById(orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException(`Cannot cancel order in ${order.status} status`);
    }

    return await this.prisma.$transaction(async (tx) => {
      // Restore stock for each product
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      // Update order status to cancelled
      return await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
    });
  }
}
