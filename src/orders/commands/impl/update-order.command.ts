import { UpdateOrderDto } from 'src/orders/dtos';
import { IMetadata, ICommand } from '../../interfaces';

export class UpdateOrderCommand implements ICommand<any> {
  constructor(
    public readonly data: UpdateOrderDto,
    public readonly meta: IMetadata,
  ) {}
}
