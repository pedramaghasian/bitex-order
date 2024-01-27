import { DynamicModule, Module } from '@nestjs/common';
import { EventStoreService } from './eventstore.service';

@Module({
  providers: [EventStoreService],
  exports: [EventStoreService],
})
export class EventStoreModule {
  static registerAsync(options: any): DynamicModule {
    const config = {
      provide: 'ES_CONFIG',
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
    const transformers = {
      provide: 'TRANSFORMERS',
      useValue: options.transformers,
    };
    const subscriptions = {
      provide: 'SUBSCRIPTIONS',
      useValue: options.subscriptions,
    };
    return {
      module: EventStoreModule,
      imports: options.imports,
      global: true,
      providers: [config, transformers, subscriptions],
      exports: [
        options.imports.find((i: any) => i.name === 'CqrsModule'),
        config,
        transformers,
        subscriptions,
      ],
    };
  }
}