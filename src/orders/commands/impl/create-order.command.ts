import { CreateOrderDto } from '../../dtos';
import { IMetadata, ICommand } from '../../interfaces';

export class CreateOrderCommand implements ICommand<any> {
  constructor(
    public readonly data: CreateOrderDto,
    public readonly meta: IMetadata,
  ) {}
}
