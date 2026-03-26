import { Module } from '@nestjs/common';
import { SanphamGameService } from '../services/sanpham_game.service';
import { SanphamGameController } from '../controllers/sanpham_game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SanphamGame } from '../entities/sanpham_game.entity';
import { Order } from 'src/entities/order.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([SanphamGame, Order]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [SanphamGameController],
  providers: [SanphamGameService],
  exports: [SanphamGameService],
})
export class SanphamGameModule {}
