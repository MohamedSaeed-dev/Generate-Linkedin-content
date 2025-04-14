import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmModule } from './llm/llm.module';
import { EmailService } from './email/email.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [LlmModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
