import { IsString } from "class-validator";

export class CreateMessageChatDto {
    @IsString()
    content: string;
}
