import { Controller, Get, Post, Put, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderStatus } from './types/order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post('checkout')
    checkout(@Request() req: any) {
        return this.orderService.checkout(req.user.userId);
    }

    @Get('my-orders')
    getUserOrders(@Request() req: any) {
        return this.orderService.getUserOrders(req.user.userId);
    }

    @Get(':id')
    getOrderById(@Param('id') id: string) {
        return this.orderService.getOrderById(parseInt(id));
    }

    @Put(':id/status')
    updateOrderStatus(
        @Param('id') id: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto
    ) {
        return this.orderService.updateOrderStatus(parseInt(id), updateOrderStatusDto.status);
    }

    @Put(':id/cancel')
    cancelOrder(@Param('id') id: string) {
        return this.orderService.cancelOrder(parseInt(id));
    }

    @Get()
    getAllOrders() {
        return this.orderService.getAllOrders();
    }

    @Get('status/:status')
    getOrdersByStatus(@Param('status') status: OrderStatus) {
        return this.orderService.getOrdersByStatus(status);
    }
}
