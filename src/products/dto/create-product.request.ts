import { IsString, IsNumber, IsNotEmpty, IsEmpty } from 'class-validator';

export class CreateProductRequest {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    price!: string;
    @IsString()
    stock!: string;

    @IsString()
    categoryId!: string;
}
