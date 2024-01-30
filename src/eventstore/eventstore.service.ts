import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventBus, IEvent, IEventPublisher } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import {
  ConnectionSettings,
  createConnection,
  createJsonEventData,
  PersistentSubscriptionSettings,
  EventStoreNodeConnection,
  expectedVersion,
  TcpEndPoint,
  ResolvedEvent,
} from 'node-eventstore-client';

@Injectable()
export class EventStoreService
  implements OnModuleInit, OnModuleDestroy, IEventPublisher
{
  private client: EventStoreNodeConnection;
  private options: ConnectionSettings;
  private endpoint: TcpEndPoint;
  private isConnected: boolean;
  private subject$: Subject<IEvent>;

  constructor(
    private readonly eventsBus: EventBus,
    @Inject('ES_CONFIG') private readonly config: any,
    @Inject('TRANSFORMERS') private readonly transformers: any,
    @Inject('SUBSCRIPTIONS') private readonly subscriptions: any,
  ) {
    this.options = {
      defaultUserCredentials: {
        username: this.config.username || 'admin',
        password: this.config.password || 'changeit',
      },
    };
    this.endpoint = {
      host: this.config.hostname || 'localhost',
      port: parseInt(this.config.port || '1113'),
    };
    this.connect();
  }

  private readonly logger = new Logger(EventStoreService.name);

  onModuleInit(): any {
    this.subject$ = (this.eventsBus as any).subject$;
    this.bridgeEventsTo((this.eventsBus as any).subject$);
    this.eventsBus.publisher = this;
  }

  onModuleDestroy(): any {
    this.client.close();
    this.client.removeAllListeners();
    this.client = null;
  }

  onConnected() {
    this.logger.log('connected');
    this.isConnected = true;
    for (const group in this.subscriptions) {
      this.subscribe(this.subscriptions[group], group);
    }
  }

  onClosed() {
    this.logger.log('closed');
    this.isConnected = false;
    this.client.removeAllListeners();
    this.client = null;
    this.connect();
  }

  connect() {
    this.client = createConnection(this.options, this.endpoint);
    this.client.connect();
    this.client.on('connected', this.onConnected.bind(this));
    this.client.on('closed', this.onClosed.bind(this));
  }

  getSubSettings() {
    const settings: any = PersistentSubscriptionSettings.create();
    settings.resolveLinkTos = true;
    settings.startFrom = 0;
    settings.minCheckPointCount = 1;
    return settings;
  }

  async subscribe(stream: string, group: string) {
    const onDrop = async (sub: any, reason: string, error: Error) => {
      this.logger.warn(
        `subscription-dropped ${stream} ${group} ${reason} ${error?.message}`,
      );
      try {
        if (this.isConnected) {
          await this.subscribe(stream, group);
        }
      } catch (err) {
        this.logger.warn(err.message);
      }
    };
    try {
      await this.client.createPersistentSubscription(
        stream,
        group,
        this.getSubSettings(),
      );
      this.logger.log(`subscription-created ${stream} ${group}`);
    } catch (err) {
      this.logger.warn(err.message);
    }
    try {
      await this.client.connectToPersistentSubscription(
        stream,
        group,
        this.onEvent.bind(this),
        onDrop,
      );
      this.logger.log(`subscription-connected ${stream} ${group}`);
    } catch (err) {
      this.logger.warn(err.message);
    }
  }

  convert(event: any) {
    const { $correlationId, $causationId, ...meta } = JSON.parse(
      event.metadata.toString(),
    );
    return this.transformers[event.eventType]({
      data: JSON.parse(event.data.toString()),
      meta: {
        ...meta,
        // eventId: event.eventId,
        requestId: event.eventId,
        correlationId: $correlationId,
        causationId: $causationId,
        timestamp: event.createdEpoch,
      },
    });
  }

  onEvent(sub: any, payload: ResolvedEvent) {
    const { event } = payload;
    this.logger.verbose(`event-appeared ${event?.eventType} ${event?.eventId}`);
    if (!event || !event.isJson || event.eventType.startsWith('$')) {
      this.logger.verbose(
        `invalid-event ${event?.eventType} ${event?.eventId}`,
      );
    } else {
      this.subject$?.next(this.convert(event));
    }
  }

  async publish(event: any) {
    const id = event.meta.requestId || event.meta.eventId;
    const cid = event.meta.correlationId;
    this.logger.verbose(
      `publish ${event.eventCategory} ${event.data.id} ${id} ${cid}`,
    );
    await this.client.appendToStream(
      `${event.eventCategory}-${event.data.id}`,
      expectedVersion.any,
      [
        createJsonEventData(
          id,
          event.data,
          {
            ...event.meta,
            $correlationId: cid,
            $causationId: event.meta.causationId,
          },
          event.eventType,
        ),
      ],
    );
  }

  async bridgeEventsTo<T extends IEvent>(subject: Subject<T>): Promise<any> {
    this.subject$ = subject;
  }

  async *readStreamFromStart(stream: string, resolveLinkTos = false) {
    const pageSize = 1000;
    let current = 0;
    while (true) {
      const slice = await this.client.readStreamEventsForward(
        stream,
        current,
        pageSize,
        resolveLinkTos,
      );
      for (const ev of slice.events) {
        yield this.convert(ev.event);
      }
      current += pageSize;
      if (slice.isEndOfStream) return;
    }
  }
}
