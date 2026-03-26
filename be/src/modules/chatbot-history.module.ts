// src/modules/chatbot-history.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotHistory } from 'src/entities/chatbot-history.entity';
import { ChatbotHistoryService } from 'src/services/chatbot-history.service';
import { ChatbotHistoryController } from 'src/controllers/chatbot-history.controller';
import { AuthModule } from 'src/modules/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatbotHistory]), AuthModule],
  providers: [ChatbotHistoryService],
  controllers: [ChatbotHistoryController],
  exports: [ChatbotHistoryService],
})
export class ChatbotHistoryModule {}
