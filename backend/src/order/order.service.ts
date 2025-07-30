import { Injectable } from '@nestjs/common';
import { createOrderDTO } from './dto/order.dto';
import { OrderRepository } from '../repository/order.repository';
import { Order } from './order.schema';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  async createOrder(orderData: createOrderDTO): Promise<Order> {
    return this.orderRepository.createOrder(orderData);
  }
}
