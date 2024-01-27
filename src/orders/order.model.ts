import { AggregateRoot } from '@nestjs/cqrs';
import { CreateOrderDto } from './dtos';
import { OrderCreatedEvent } from './events/impl/order-created.event';
import { IMetadata } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

export class Order extends AggregateRoot {

    public id: string;

    public name: string;

    create(data: CreateOrderDto, meta: IMetadata) {

        if (this.id) {
            throw new Error(`Duplication Id: ${this.id}`);
        }
        this.apply(new OrderCreatedEvent({ ...data, id: uuidv4() }, { ...meta, eventId: uuidv4() }));
    }

    onOrderCreatedEvent(event: OrderCreatedEvent) {
        this.id = event.data.id;
        this.name = event.data.name;
    }

}

