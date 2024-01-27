import { CreateOrderCommand } from '../impl';
import { OrderRepository } from '../../../orders/order.repository';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';


@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler
  implements ICommandHandler<CreateOrderCommand> {
  constructor(
    private readonly repository: OrderRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateOrderCommand) {

    const {data} = command
    const order = this.publisher.mergeObjectContext(
      await this.repository.create(data),
    );

    order.commit();
  }
}