import { IMessage } from "./message.interface";

export interface IMetadata {
  version: number;
  timestamp: number;
  requestId: string;
  correlationId: string;
  causationId: string;
  messages?: IMessage[];
}