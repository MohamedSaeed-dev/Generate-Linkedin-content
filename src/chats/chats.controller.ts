import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { ChatsService } from './chats.service';
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @Post()
  async create(@Res() res: Response) {
    const { data, status } = await this.chatsService.create();
    return res.status(status).json(data);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const { data, status } = await this.chatsService.findAll();
    return res.status(status).json(data);
  }

  @Delete(':chatId')
  async delete(@Param('chatId') chatId: string, @Res() res: Response) {
    const { data, status } = await this.chatsService.delete(chatId);
    return res.status(status).json(data);
  }

}
