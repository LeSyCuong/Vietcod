// src/modules/company-info.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyInfo } from 'src/entities/company_info.entity';
import { CompanyInfoService } from 'src/services/company-info.service';
import { CompanyInfoController } from 'src/controllers/company-info.controller';
import { AuthModule } from 'src/modules/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyInfo]), AuthModule],
  providers: [CompanyInfoService],
  controllers: [CompanyInfoController],
  exports: [CompanyInfoService],
})
export class CompanyInfoModule {}
