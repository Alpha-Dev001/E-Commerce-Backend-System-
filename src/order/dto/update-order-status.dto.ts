import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { OrderStatus } from '../types/order-status.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
