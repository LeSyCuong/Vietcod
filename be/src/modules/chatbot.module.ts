import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotController } from '../controllers/chatbot.controller';
import { ChatbotService } from '../services/chatbot.service';
import { ChatbotHistoryService } from '../services/chatbot-history.service';
import { CompanyInfo } from '../entities/company_info.entity';
import { Account } from '../entities/account.entity';
import { ChatbotHistory } from '../entities/chatbot-history.entity';
import { AccountModule } from './account.module';
import { AiModule } from './ai.module';
import { ConTactModule } from './contact.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyInfo, Account, ChatbotHistory]),
    AccountModule,
    AiModule,
    ConTactModule,
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatbotHistoryService],
  exports: [ChatbotHistoryService],
})
export class ChatBotModule {}
