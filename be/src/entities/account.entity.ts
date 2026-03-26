import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  /**
   * Chuyển sang nullable: true vì tài khoản Google Login không có password.
   * Thêm length: 255 để tối ưu hóa lưu trữ cho các chuỗi hash bcrypt/argon2.
   */
  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null;

  @Index()
  @Column()
  email: string;

  @Column({ default: 0 })
  vnd: number;

  @Column({ default: 0 })
  lock: number;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  forgotToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  updatepass?: Date;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @Column({ type: 'text', nullable: true })
  refreshToken?: string | null;

  @Column({ type: 'text', nullable: true })
  accessToken?: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
