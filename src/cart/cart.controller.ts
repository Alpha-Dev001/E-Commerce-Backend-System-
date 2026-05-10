import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private cartService: CartService,
  ) { }

  @Post()
  addToCart(@Body() body: any, @Request() req: any) {
    return this.cartService.addToCart(
      req.user.userId,
      body.productId,
      body.quantity,
    );
  }

  @Get()
  getCart(@Request() req: any) {
    return this.cartService.getCart(
      req.user.userId,
    );
  }
}