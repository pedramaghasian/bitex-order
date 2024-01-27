import { Controller, Get } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderCommand } from './commands/impl';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderSvc: OrderService) { }


  @MessagePattern('commands.createOrder')
  async killDragon(@Payload() message: any, @Ctx() context: KafkaContext) {
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
}
