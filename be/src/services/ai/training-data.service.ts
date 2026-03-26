// src/ai/training-data.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatbotHistory } from 'src/entities/chatbot-history.entity';

@Injectable()
export class TrainingDataService {
  constructor(
    @InjectRepository(ChatbotHistory)
    private readonly chatRepo: Repository<ChatbotHistory>,
  ) {}

  async exportDataset(): Promise<{ prompt: string; completion: string }[]> {
    const history = await this.chatRepo.find({ order: { created_at: 'ASC' } });

    const grouped: Record<number, ChatbotHistory[]> = {};

    history.forEach((h) => {
      if (!grouped[h.userId]) grouped[h.userId] = [];
      grouped[h.userId].push(h);
    });

    const dataset: { prompt: string; completion: string }[] = [];

    for (const chats of Object.values(grouped)) {
      for (let i = 0; i < chats.length - 1; i++) {
        const curr = chats[i];
        const next = chats[i + 1];

        if (curr.role === 'user' && next.role === 'bot') {
          dataset.push({
            prompt: curr.text,
            completion: next.text,
          });
        }
      }
    }

    return dataset;
  }
}
