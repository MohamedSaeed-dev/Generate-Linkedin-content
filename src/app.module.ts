import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmModule } from './llm/llm.module';
import { EmailService } from './email/email.service';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';
import { LoggerService } from './logger/logger.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptions/http-exceptions.exception';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    LlmModule, AuthModule, ChatsModule, MessagesModule,LoggerModule ],
  controllers: [AppController],
  providers: [AppService, EmailService,  LoggerService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },],
})
export class AppModule {}
