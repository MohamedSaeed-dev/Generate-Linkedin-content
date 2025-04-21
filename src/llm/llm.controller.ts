import {
  Controller,
  Get,
  Query
} from '@nestjs/common';
import { AskLlmDto } from './dto/ask-llm.dto';
import { LlmService } from './llm.service';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) { }

  @Get()
  ask(@Query() query: AskLlmDto) {
    return this.llmService.ask(query.question, query.chatId, query.session);
  }
  @Get('ask-auto')
  askAutomated() {
    return this.llmService.askAutomated();
  }
}
