// src/cron/cron.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { CronService } from '../services/cron_bank.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule, // Nếu bạn muốn gửi HTTP request
  ],
  providers: [CronService],
  exports: [CronService], // Bạn có thể export service này nếu cần sử dụng trong các module khác
})
export class CronModule {}
