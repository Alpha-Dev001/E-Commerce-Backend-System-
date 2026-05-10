import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post('checkout')
    checkout(@Request() req: any) {
        return this.orderService.checkout(req.user.userId);
    }
}
