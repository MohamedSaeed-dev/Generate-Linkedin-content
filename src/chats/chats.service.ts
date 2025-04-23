import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly prisma: PrismaService,
  ) { }
  async create() {
    const chat = await this.prisma.chat.create({
      data: {
        userId: this.request['user'].id,
      },
    });
    return { data: chat, status: HttpStatus.OK };
  }

  async findAll() {
    const chats = await this.prisma.chat.findMany({
      where: {
        userId: this.request['user'].id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt:'asc'
          }
        }
      },
      orderBy: {
        createdAt:'desc'
      }
    });
    return { data: chats, status: HttpStatus.OK };
  }

  async delete(id: string) {
    if (!await this.prisma.chat.count({ where: { id: id } })) return { data: { message: 'Chat not found' }, status: HttpStatus.NOT_FOUND };
    const chat = await this.prisma.chat.delete({
      where: {
        id: id,
      }
    })
    return { data: chat, status: HttpStatus.OK };
  }

}
