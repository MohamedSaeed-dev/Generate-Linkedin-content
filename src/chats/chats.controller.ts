import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import {  CreateMessageChatDto } from './dto/create-message-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Response } from 'express';
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async create(@Res() res: Response) {
    const { data, status } = await this.chatsService.create();
    return res.status(status).json(data);
  }

  @Post(':id')
  async createMessage(@Param('id') id: string, @Body() body: CreateMessageChatDto ,@Res() res: Response) {
    const { data, status } = await this.chatsService.createMessage(id, body);
    return res.status(status).json(data);
  }

  @Get()
  findAll() {
    return this.chatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(+id);
  }
}
