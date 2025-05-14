import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class SignUpRequest {
    @IsString()
    name!: string;
    @IsString()
    phone!: string;
    @IsString()
    city!: string;
    @IsString()
    district!: string;
    @IsString()
    ward!: string;
    @IsString()
    address!: string;
    @IsString()
    @IsEmail()
    email!: string;
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    },
        {
            message: 'Mật khẩu phải dài ít nhất 8 ký tự và bao gồm ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký hiệu.'
        })
    password!: string;
    @IsString()
    confirmPassword!: string;
};