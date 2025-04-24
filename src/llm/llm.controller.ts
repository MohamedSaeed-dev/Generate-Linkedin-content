import {
  Controller,
  Get,
  Header,
  Query,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { AskLlmDto } from './dto/ask-llm.dto';
import { LlmService } from './llm.service';
@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) { }
  @Get()
  @Public()
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  async ask(@Query() query: AskLlmDto, @Res() res: Response) {
    await this.llmService.ask(query.question, query.chatId, query.session, res);
  }
  @Get('ask-auto')
  @Public()
  askAutomated() {
    return this.llmService.askAutomated();
  }
}
