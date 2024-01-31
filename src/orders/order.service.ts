import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderCommand, UpdateOrderCommand } from './commands/impl';
import { GetOrders } from './queries/impl';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createOrder(data: any, headers: any) {
    return this.commandBus.execute(
      new CreateOrderCommand(
        { ...data, id: uuidv4() },
        { ...headers, eventId: uuidv4() },
      ),
    );
  }

  async updateOrder(data: any, headers: any) {
    return this.commandBus.execute(new UpdateOrderCommand(data, headers));
  }

  async getOrders() {
    return this.queryBus.execute(new GetOrders({}, {}));
  }
}
