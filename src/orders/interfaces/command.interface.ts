import { ICommand as ICqrsCommand } from '@nestjs/cqrs';
import { IMetadata } from './metadata.interface';

export interface ICommand<T> extends ICqrsCommand {
  data: T;
  meta: IMetadata;
}