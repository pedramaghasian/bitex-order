// import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
// import { CreateOrderCommand } from '../impl';


// @CommandHandler(CreateOrderCommand)
// export class CreateOrderHandler
//   implements ICommandHandler<CreateOrderCommand> {
//   constructor(
//     private readonly repository: OrderRepository,
//     private readonly publisher: EventPublisher,
//   ) {}

//   async execute(command: CreateOrderCommand, resolve: (value?) => void) {
//     const device = this.publisher.mergeObjectContext(
//       await this.repository.create(command.data),
//     );
//     device.commit();
//     resolve();
//   }
// }