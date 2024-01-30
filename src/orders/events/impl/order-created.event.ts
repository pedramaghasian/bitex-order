import { CreateOrderDto } from 'src/orders/dtos';
import { IMetadata } from 'src/orders/interfaces';
import { BaseEvent } from './base.event';

export class OrderCreatedEvent extends BaseEvent {
  constructor(
    public readonly data: CreateOrderDto,
    public readonly meta: IMetadata,
  ) {
    super();
    this.eventType = Object.getPrototypeOf(this).constructor.name;
  }
}
