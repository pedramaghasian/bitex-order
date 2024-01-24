import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './commands/impl';

@Injectable()
export class OrderService {

  constructor(private readonly commandBus: CommandBus) { }

  async createOrder(data, headers) {
    return this.commandBus.execute(new CreateOrderCommand(data, headers));
  }
}
