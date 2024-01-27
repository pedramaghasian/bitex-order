import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderSvc: OrderService) { }


  @MessagePattern('commands.createOrder')
  async createOrder(@Payload() message: any, @Ctx() context: KafkaContext) {
    try {
      const originalMessage = context.getMessage();
      const { data, headers } = message
      await this.orderSvc.createOrder(data, headers);
      return { msg: "Ok" }
    } catch (error) {
      console.log(error)
      return { msg: "Failed", error }
    }
  }

  @MessagePattern('queryies.getOrders')
  async getOrders() {
    try {
      return await this.orderSvc.getOrders();
    } catch (error) {
      console.log(error)
      return { msg: "Failed", error }
    }
  }
}
