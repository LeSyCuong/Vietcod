import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatbotHistory } from '../entities/chatbot-history.entity';
import { CreateChatbotHistoryDto } from 'src/dto/create/create-chatbot-history.dto';
import { UpdateChatbotHistoryDto } from 'src/dto/update/update-chatbot-history.dto';

@Injectable()
export class ChatbotHistoryService {
  constructor(
    @InjectRepository(ChatbotHistory)
    private readonly repo: Repository<ChatbotHistory>,
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async create(data: CreateChatbotHistoryDto) {
    const item = this.repo.create(data);
    return await this.repo.save(item);
  }

  async update(id: number, data: UpdateChatbotHistoryDto) {
    await this.repo.update(id, data);
    const updated = await this.repo.findOneBy({ id });
    if (!updated) throw new NotFoundException();
    return updated;
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }

  async saveMessage(userId: number, role: 'user' | 'bot', text: string) {
    const latest = await this.repo.findOne({
      where: { userId, role },
      order: { created_at: 'DESC' },
    });

    if (latest && latest.text === text) {
      return;
    }

    const newHistory = this.repo.create({ userId, role, text });
    await this.repo.save(newHistory);
  }

  async getHistory(userId: number): Promise<ChatbotHistory[]> {
    return this.repo.find({
      where: { userId },
      order: { created_at: 'ASC' },
    });
  }
}
