import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { OrderRepository } from './order.repository';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [
    CqrsModule , 
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot()
  ],
  controllers: [OrderController],
  providers: [
    OrderService, 
    OrderRepository, 
    ...CommandHandlers, 
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class OrderModule { }
