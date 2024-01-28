import { CreateOrderDto, UpdateOrderDto } from './dtos';
import { OrderCreatedEvent } from './events/impl/order-created.event';
import { IMetadata } from './interfaces';
import { v4 as uuidv4 } from 'uuid';
import { OrderUpdatedEvent } from './events/impl';
import { BaseAggregate } from './base-aggregate';

export class Order extends  BaseAggregate {

    public id: string;

    public name: string;

    create(data: CreateOrderDto, meta: IMetadata) {

        if (this.id) {
            throw new Error(`Duplication Id: ${this.id}`);
        }
        this.apply(new OrderCreatedEvent({ ...data, id: uuidv4() }, this.getVersionedMeta({ ...meta, eventId: uuidv4() })));
    }

    onOrderCreatedEvent(event: OrderCreatedEvent) {
        this.id = event.data.id;
        this.name = event.data.name;
        this.versionHistory[event.meta.version] = event.meta;
    }

    update(data: UpdateOrderDto, meta: IMetadata) {
        this.apply(new OrderUpdatedEvent({ ...data }, this.getVersionedMeta({ ...meta, eventId: uuidv4() })));
    }

    onOrderUpdatedEventt(event: OrderUpdatedEvent) {
        this.id = event.data.id
        this.name = event.data.name;
        this.versionHistory[event.meta.version] = event.meta;
    }
}

