import { IsNotEmpty, MinLength } from "class-validator"

export class CreateMessageDto {
    @IsNotEmpty()
    text: string
}
