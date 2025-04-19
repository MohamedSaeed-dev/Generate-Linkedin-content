import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageChatDto } from './create-message-chat.dto';

export class UpdateChatDto extends PartialType(CreateMessageChatDto) {}
