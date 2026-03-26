// src/modules/config-web.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from 'src/entities/config.entity';
import { ConfigService } from 'src/services/config.service';
import { ConfigController } from 'src/controllers/config.controller';
import { AuthModule } from 'src/modules/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Config]), AuthModule],
  providers: [ConfigService],
  controllers: [ConfigController],
  exports: [ConfigService],
})
export class ConfigWebModule {}
