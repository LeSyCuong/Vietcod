import { Module } from '@nestjs/common';
import { BankService } from '../services/bank_auto.service';
import { BankController } from '../controllers/bank_auto.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './order.module';
import { Order } from 'src/entities/order.entity';
import { BankAuto } from 'src/entities/bank_auto.entity';
import { Account } from 'src/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([Order, BankAuto, Account]),
    ConfigModule,
    OrderModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
