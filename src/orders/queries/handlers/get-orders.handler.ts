import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetOrders } from '../impl';
import { OrderRepository } from 'src/orders/order.repository';

@QueryHandler(GetOrders)
export class GetOrdersHandler implements IQueryHandler<GetOrders> {
  private readonly logger = new Logger(GetOrdersHandler.name);

  constructor(private repository: OrderRepository) { }

  async execute(query: GetOrders) {
    this.logger.verbose('GetOrdersHandler');
    return this.repository.findMany();
  }
}