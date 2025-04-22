import {
  Controller,
  Get,
  Header,
  Query,
  Res
} from '@nestjs/common';
import { AskLlmDto } from './dto/ask-llm.dto';
import { LlmService } from './llm.service';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';

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
  askAutomated() {
    return this.llmService.askAutomated();
  }
}
