// src/entities/chatbot-history.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('chatbot_history')
export class ChatbotHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column()
  role: string;

  @Column('text')
  text: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
