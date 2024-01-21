import { Module } from '@nestjs/common';
import { OrderController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'EVENTS',
          type: 'topic',
        },
        {
          name: 'COMMANDS',
          type: 'direct',
        },
        {
          name: 'QUERIES',
          type: 'direct',
        },
      ],
      uri: 'amqp://rabbitmq:rabbitmq@localhost:5672',
      connectionInitOptions: { wait: false },
    }),  
    // OrderModule,
  ],
  controllers: [OrderController],
  providers: [AppService],
  exports: [RabbitMQModule]
})
export class AppModule {}
