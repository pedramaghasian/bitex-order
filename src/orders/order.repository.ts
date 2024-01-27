import { Injectable } from '@nestjs/common';
import { Order } from './order.model';
import { CreateOrderDto } from './dtos';

@Injectable()
export class OrderRepository {

    async create(data: CreateOrderDto): Promise<Order> {
        const order = new Order('1')
        return order;
    }

    // async createOne(dto: CreateOrderDto) {
    //     const doc = await this.model.create(dto);
    //     const orderRoot = new OrderRoot(doc.id);
    //     orderRoot.setData(doc);
    //     return orderRoot;
    // }


}