import { Controller, Get } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderCommand } from './commands/impl';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderSvc: OrderService) { }


  @MessagePattern('commands.createOrder')
  killDragon(@Payload() message: any, @Ctx() context: KafkaContext): any {
    const originalMessage = context.getMessage();
    const { data, headers } = message
    return this.orderSvc.createOrder(data, headers);
  }
}
