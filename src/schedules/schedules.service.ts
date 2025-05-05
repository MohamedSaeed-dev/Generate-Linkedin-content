import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LlmService } from 'src/llm/llm.service';
@Injectable()
export class SchedulesService {
  constructor(private readonly llmService: LlmService) { }
  private readonly logger = new Logger(SchedulesService.name);

  @Cron('0 0 15 * * *', {
    timeZone: 'Asia/Riyadh'
  })
  async handleCron() {
    this.logger.debug('Cron job running at 3:00 PM daily');
    await this.llmService.askAutomated();
  }
}
