import { GetOrdersDto } from "src/orders/dtos";
import { IMetadata } from "src/orders/interfaces";
import { IQuery } from "src/orders/interfaces/query.interface";


export class GetOrders implements IQuery<GetOrdersDto> {
  constructor(
    public readonly data: any,
    public readonly meta: IMetadata,
  ) { }
}