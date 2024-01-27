import { Module } from '@nestjs/common';
import { OrderController } from './orders/order.controller';
import { OrderService } from './orders/order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'kafka_client_id',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'kafka_group_id',
          },
        },
      },
    ]),
    OrderModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AppModule {}
