import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { OrderCreatedEvent } from '../impl/order-created.event';
import { OrderRepository } from 'src/orders/order.repository';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedEventHandler
  implements IEventHandler<OrderCreatedEvent>
{
  constructor(private readonly repository: OrderRepository) {}
  async handle(event: OrderCreatedEvent) {
    try {
      await this.repository.create(event.data);
    } catch (error) {
      console.log(error);
    }
  }
}
