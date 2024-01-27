import { Injectable } from '@nestjs/common';
import { Order } from './order.model';

import { EventStoreService } from 'src/eventstore/eventstore.service';
import { PrismaService } from 'nestjs-prisma';
import {Prisma} from '@prisma/client'

@Injectable()
export class OrderRepository {
  constructor(
    private prisma: PrismaService,
    private eventStore: EventStoreService,
  ) { }

  async findOneById(id: string) {
    const organization = new Order();
    for await (const event of this.eventStore.readStreamFromStart(`orders-${id}`)) {
      organization.apply(event, true);
    }
    return organization;
  }


  async create(data:Prisma.OrderCreateInput): Promise<any> {
    return this.prisma.order.create({
      data,
    });
  }

  async findMany(): Promise<any> {
    return this.prisma.order.findMany();
  }

}