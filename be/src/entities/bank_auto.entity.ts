// src/entities/bank_auto.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bank_auto')
export class BankAuto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'int' })
  transaction_id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
