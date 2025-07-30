import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { createOrderDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async createOrder(@Body() orderData: createOrderDTO) {
    return this.orderService.createOrder(orderData);
  }
}
