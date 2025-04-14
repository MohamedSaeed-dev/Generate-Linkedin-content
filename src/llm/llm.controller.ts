import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { LlmService } from './llm.service';
import { AskLlmDto } from './dto/ask-llm.dto';
import { Response } from 'express';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Get()
  ask(@Query() query: AskLlmDto) {
    return this.llmService.ask(query.question, query.session);
  }
  @Get('ask-auto')
  askAutomated() {
    return this.llmService.askAutomated();
  }
}
