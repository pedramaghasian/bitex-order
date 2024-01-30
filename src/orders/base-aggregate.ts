import { AggregateRoot } from '@nestjs/cqrs';
import { IMetadata } from './interfaces';

export class BaseAggregate extends AggregateRoot {
  protected id: string;

  protected versionHistory: Record<number, IMetadata> = {};

  getVersionedMeta(meta: IMetadata): IMetadata {
    return {
      ...meta,
      version:
        Math.max(
          0,
          ...Object.keys(this.versionHistory).map((k) => parseInt(k, 10)),
        ) + 1,
      timestamp: new Date().getTime(),
    };
  }
}
