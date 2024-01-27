import { CreateOrderDto } from "src/orders/dtos";
import { IMetadata } from "src/orders/interfaces";

export class OrderCreatedEvent {
    constructor(
        public readonly data: CreateOrderDto,
        public readonly meta: IMetadata,
    ) {}
  }