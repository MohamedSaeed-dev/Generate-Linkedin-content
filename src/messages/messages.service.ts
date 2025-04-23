import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageChatDto } from './dto/create-message-chat.dto';
import { MessageType } from './enums/message-type.enum';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }
  async create(chatId: string, body: CreateMessageChatDto) {
    const message = await this.prisma.message.create({
      data: {
        chatId: chatId,
        content: body.content,
        senderId: MessageType.YOU
      }
    })
    return { data: message, status: HttpStatus.OK };
  }

  async findAll(chatId: string) {
    const chats = await this.prisma.message.findMany({
      where: {
        chatId: chatId,
      },
      orderBy: {
        createdAt:'asc'
      }
    });
    return { data: chats, status: HttpStatus.OK };
  }

  async delete(id: string) {
    if (!await this.prisma.message.count({ where: { id: id } })) return { data: { message: 'Message not found' }, status: HttpStatus.NOT_FOUND };
    const message = await this.prisma.message.delete({
      where: {
        id: id,
      }
    })
    return { data: message, status: HttpStatus.OK };
  }
}
