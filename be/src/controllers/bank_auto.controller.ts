// src/controllers/bank.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../middlewares/auth/jwt-auth.guard';
import { BankService } from '../services/bank_auto.service';

interface JwtPayload {
  sub: number;
  email?: string;
  [key: string]: any;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getMyTransactions(@Req() req: AuthRequest) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User không hợp lệ');

    const transactions = await this.bankService.getTransactionsByUser(userId);
    return transactions;
  }

  @Get('scan')
  async scanTransactions() {
    await this.bankService.processTransactions();
    return { success: true, message: 'Đang quét giao dịch từ API...' };
  }

  @Get('transactions')
  async getTransactions() {
    return await this.bankService.getAllTransactions();
  }
}
