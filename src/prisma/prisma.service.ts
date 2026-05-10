import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

// Import the generated Prisma client
const { PrismaClient } = require('.prisma/client');

@Injectable()
export class PrismaService implements OnModuleInit {
  private prisma: any;

  constructor() {
    this.prisma = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
      }),
    });
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  get user() {
    return this.prisma.user;
  }

  get product() {
    return this.prisma.product;
  }

  get cart() {
    return this.prisma.cart;
  }

  get cartItem() {
    return this.prisma.cartItem;
  }

  async $connect() {
    return this.prisma.$connect();
  }

  async $disconnect() {
    return this.prisma.$disconnect();
  }
}