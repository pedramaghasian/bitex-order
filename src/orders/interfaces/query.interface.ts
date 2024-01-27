import { IQuery as ICqrsQuery } from '@nestjs/cqrs';
import { IMetadata } from './metadata.interface';

export interface IQuery<T> extends ICqrsQuery {
  data: T;
  meta: IMetadata;
}