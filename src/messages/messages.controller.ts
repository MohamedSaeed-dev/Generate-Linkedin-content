import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateMessageChatDto } from './dto/create-message-chat.dto';
import { MessagesService } from './messages.service';

@Controller('')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post('chats/:id/messages')
  async create(@Param('id') id: string, @Body() body: CreateMessageChatDto, @Res() res: Response) {
    const { data, status } = await this.messagesService.create(id, body);
    return res.status(status).json(data);
  }

  @Get('chats/:id/messages')
  async findAll(@Param('id') id: string, @Res() res: Response) {
    const { data, status } = await this.messagesService.findAll(id);
    return res.status(status).json(data);
  }

  @Delete('messages/:messageId')
  async delete(@Param('messageId') messageId: string, @Res() res: Response) {
    const { data, status } = await this.messagesService.delete(messageId);
    return res.status(status).json(data);
  }
}
