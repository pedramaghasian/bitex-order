import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import {  OrderUpdatedEvent } from '../impl';
import { OrderRepository } from 'src/orders/order.repository';

@EventsHandler(OrderUpdatedEvent)
export class OrderUpdatedEventHandler
  implements IEventHandler<OrderUpdatedEvent> {
  constructor(private readonly repository: OrderRepository) { }
  async handle(event: OrderUpdatedEvent) {
    const {id, ...rest} = event.data
    try {
      this.repository.update(id, rest)
    } catch (error) {
      console.log(error)
    }
  }
}