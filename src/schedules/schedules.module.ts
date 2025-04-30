import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { LlmModule } from 'src/llm/llm.module';

@Module({
  imports:[LlmModule],
  providers: [SchedulesService],
})
export class SchedulesModule {}
