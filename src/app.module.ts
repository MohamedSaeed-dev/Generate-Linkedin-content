import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmModule } from './llm/llm.module';
import { EmailService } from './email/email.service';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LlmModule, AuthModule, ChatsModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
