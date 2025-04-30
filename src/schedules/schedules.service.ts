import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LlmService } from 'src/llm/llm.service';
@Injectable()
export class SchedulesService {
  constructor(private readonly llmService: LlmService) { }
  private readonly logger = new Logger(SchedulesService.name);

  @Cron('* * * * *')
  async handleCron() {
    this.logger.debug('Cron job running every 1 minute');
    await this.llmService.askAutomated();
  }

}
