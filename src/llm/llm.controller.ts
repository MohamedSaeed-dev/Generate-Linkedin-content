import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { LlmService } from './llm.service';
import { AskLlmDto } from './dto/ask-llm.dto';
import { Response } from 'express';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  // @Post()
  // create(@Body() createLlmDto: CreateLlmDto) {
  //   return this.llmService.create(createLlmDto);
  // }

  @Get()
  findAll(@Query() query: AskLlmDto, @Res({ passthrough: true }) res: Response,) {
    return this.llmService.ask((query.question),(query.session || 'abc'), res);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.llmService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLlmDto: UpdateLlmDto) {
  //   return this.llmService.update(+id, updateLlmDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.llmService.remove(+id);
  // }
}
