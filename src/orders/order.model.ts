import { AggregateRoot } from '@nestjs/cqrs';
import { CreateOrderDto } from './dtos';

export class Order extends AggregateRoot {
    constructor(private readonly id: string) {
        super();
    }

    create(data: CreateOrderDto) {
        this.apply(new OrderCreatedEvent(this.id, data));
    }

}