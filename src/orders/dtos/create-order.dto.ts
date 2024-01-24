import {
    IsString, IsNotEmpty,
} from 'class-validator';

export class CreateOrderDto {

    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

}