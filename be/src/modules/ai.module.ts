// src/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenRouterService } from 'src/services/ai/openrouter.service';
import { RagService } from 'src/services/ai/rag.service';
import { SanphamGameModule } from './sanpham_game.module';
import { CompanyInfoModule } from '../modules/company-info.module';

@Module({
  imports: [HttpModule, CompanyInfoModule, SanphamGameModule],
  providers: [OpenRouterService, RagService],
  exports: [OpenRouterService, RagService],
})
export class AiModule {}
