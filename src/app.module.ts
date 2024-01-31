import { Module } from '@nestjs/common';
import { OrderController } from './orders/order.controller';
import { OrderService } from './orders/order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderModule } from './orders/order.module';
import { OrderCreatedEvent } from './orders/events/impl/order-created.event';
import { EventStoreModule } from './eventstore/eventstore.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderUpdatedEvent } from './orders/events/impl';

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
            sessionTimeout: 20000, 
            heartbeatInterval: 2000,
            allowAutoTopicCreation: false, 
          },
        },
      },
    ]),
    // EventStore Module
    EventStoreModule.registerAsync({
      imports: [ConfigModule, CqrsModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        username: configService.get('EVENTSTORE_USERNAME', 'admin'),
        password: configService.get('EVENTSTORE_PASSWORD', 'changeit'),
        hostname: configService.get('EVENTSTORE_HOSTNAME', 'localhost'),
        port: parseInt(configService.get('EVENTSTORE_PORT', '1113'), 10),
      }),
      subscriptions: {
        orders: '$ce-orders',
      },
      transformers: {
        OrderCreatedEvent: (event: any) =>
          new OrderCreatedEvent(event.data, event.meta),
        OrderUpdatedEvent: (event: any) =>
          new OrderUpdatedEvent(event.data, event.meta),
      },
    }),
    OrderModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AppModule { }
