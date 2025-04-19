import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateMessageChatDto } from './dto/create-message-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly prisma: PrismaService,
  ) {}
  async create() {
    const chat = await this.prisma.chat.create({
      data: {
        userId: this.request['user'].id,
      },
    });
    return { data: chat, status: HttpStatus.OK };
  }

  async createMessage(id: string, body: CreateMessageChatDto) {
    const message = await this.prisma.message.create({
      data: {
        chatId: id,
        content: body.content,
        senderId: body.type
      }
    })
    return { data: message, status: HttpStatus.OK };
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
