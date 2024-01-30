import { Injectable } from '@nestjs/common';
import { Order } from './order.model';

import { EventStoreService } from 'src/eventstore/eventstore.service';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(
    private prisma: PrismaService,
    private eventStore: EventStoreService,
  ) {}

  async findOneById(id: string) {
    const order = new Order();
    for await (const event of this.eventStore.readStreamFromStart(
      `orders-${id}`,
    )) {
      order.apply(event, true);
    }
    return order;
  }

  async create(data: Prisma.OrderCreateInput): Promise<any> {
    return this.prisma.order.create({
      data,
    });
  }

  async update(id: string, data: Prisma.OrderUpdateInput): Promise<any> {
    const updatedOrder = await this.prisma.order.update({
      where: {
        id: id.toString(),
      },
      data: {
        ...data,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        isPaid: true,
      },
    });

    return updatedOrder;
  }

  async findMany(): Promise<any> {
    return this.prisma.order.findMany();
  }
}
