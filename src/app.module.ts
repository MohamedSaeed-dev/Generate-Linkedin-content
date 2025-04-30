import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { EmailService } from './email/email.service';
import { HttpExceptionFilter } from './filters/http-exceptions.filter';
import { LlmModule } from './llm/llm.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerService } from './logger/logger.service';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    LlmModule, AuthModule, ChatsModule, MessagesModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService, EmailService, LoggerService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },],
})
export class AppModule { }
