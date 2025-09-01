import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO, OrderResponseDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() orderData: CreateOrderDTO,
  ): Promise<OrderResponseDTO> {
    return this.orderService.createOrder(orderData);
  }
}
