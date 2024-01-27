import { AggregateRoot } from '@nestjs/cqrs';
import { CreateOrderDto } from './dtos';
import { OrderCreatedEvent } from './events/impl/order-created.event';

export class Order extends AggregateRoot {
    data: any;

    constructor(private readonly id: string) {
        super();
    }

    setData(data: any) {
        this.data = data;
    }

    createOrder() {
        this.apply(new OrderCreatedEvent(this.data, {}));
    }

}