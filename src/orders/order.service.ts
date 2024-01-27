import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderCommand, UpdateOrderCommand } from './commands/impl';
import { GetOrders } from './queries/impl';

@Injectable()
export class OrderService {

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) { }

  async createOrder(data, headers) {
    return this.commandBus.execute(new CreateOrderCommand(data, headers));
  }

  async updateOrder(data, headers) {
    return this.commandBus.execute(new UpdateOrderCommand(data, headers));
  }

  async getOrders() {
    return this.queryBus.execute(new GetOrders({}, {}));
  }
}
