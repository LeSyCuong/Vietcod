// src/config/config.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('config')
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lang: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  font: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ogTitle: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ogDescription: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  img: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({
    name: 'updated',
    type: 'datetime',
    nullable: true,
  })
  updatedAt: Date;
}
