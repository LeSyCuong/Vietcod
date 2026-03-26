// src/mail/ConTact.module.ts
import { Module } from '@nestjs/common';
import { ConTactService } from '../services/contact.service';
import { ConTactController } from '../controllers/contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConTact } from '../entities/contact.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ConTact]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'default_fallback_secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
    AuthModule,
  ],
  controllers: [ConTactController],
  providers: [ConTactService],
  exports: [ConTactService],
})
export class ConTactModule {}
