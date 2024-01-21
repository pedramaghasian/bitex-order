import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';

@Controller()
export class OrderController {
  constructor(private readonly appService: AppService) {}

  @RabbitRPC({
    exchange: 'COMMANDS',
    routingKey: "commands.Orders.create_order",
    queue: 'orders_queue',
    queueOptions: { durable: false },
  })
  public async rpcHandler(msg: {}) {
    console.log(msg)
    return {
      response: 42,
    };
  }
}
