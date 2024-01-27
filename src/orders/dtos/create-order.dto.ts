import {
    IsString, IsNotEmpty, IsUUID,
} from 'class-validator';

export class CreateOrderDto {

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}