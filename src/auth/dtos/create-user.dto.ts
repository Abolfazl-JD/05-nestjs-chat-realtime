import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
    
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    username: string

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    password: string
}