import { UpdateOrderCommand } from '../impl';
import { OrderRepository } from '../../../orders/order.repository';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';


@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler
  implements ICommandHandler<UpdateOrderCommand> {
  constructor(
    private readonly repository: OrderRepository,
    private readonly publisher: EventPublisher,
  ) { }

  async execute(command: UpdateOrderCommand) { 
    const { data, meta } = command;
    try {
      const order = this.publisher.mergeObjectContext(
        await this.repository.findOneById(data.id),
      );
      order.update(data, meta);
      order.commit();
    } catch (e) {
      console.log(e)
    }
  }
} 