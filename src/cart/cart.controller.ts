import {
  Controller,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';

import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(
    private cartService: CartService,
  ) {}

  @Post()
  addToCart(@Body() body: any) {
    return this.cartService.addToCart(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(
      Number(userId),
    );
  }
}