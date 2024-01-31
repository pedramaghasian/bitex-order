import { CreateOrderCommand } from '../impl';
import { OrderRepository } from '../../../orders/order.repository';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler
  implements ICommandHandler<CreateOrderCommand> {
  constructor(
    private readonly repository: OrderRepository,
    private readonly publisher: EventPublisher,
  ) { }

  async execute(command: CreateOrderCommand) {
    const { data, meta } = command;
    try {
      const order = this.publisher.mergeObjectContext(
        await this.repository.findOneById(data.id),
      );
      order.create(data, meta);
      order.commit();
    } catch (e) {
      console.log(e)
    }
  }
}