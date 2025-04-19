import { IsEnum, IsString } from "class-validator";
import { MessageType } from "../enums/message-type.enum";

export class CreateMessageChatDto {
    @IsString()
    content: string;
    @IsEnum(MessageType)
    type: MessageType
}
