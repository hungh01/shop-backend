import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductCategoryRequest {
    @IsString()
    @IsNotEmpty()
    name!: string;
    @IsString()
    description!: string;
}