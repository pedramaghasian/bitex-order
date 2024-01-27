import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { OrderRepository } from './order.repository';

@Module({
  imports: [CqrsModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, ...CommandHandlers, ...EventHandlers],
})
export class OrderModule { }
