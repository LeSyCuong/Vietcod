// src/cron/cron.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CronService {
  constructor(private readonly httpService: HttpService) {}

  // @Cron('*/30 * * * * *')
  // async handleCron() {
  //   const url = process.env.SERVER_URL + '/server/bank/scan';

  //   try {
  //     const response = await lastValueFrom(this.httpService.get(url));
  //     console.log('GET request sent successfully:', response.data);
  //   } catch (error) {
  //     console.error('Error sending GET request:', error);
  //   }
  // }
}
