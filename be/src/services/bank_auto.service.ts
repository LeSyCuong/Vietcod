// src/services/bank.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAuto } from '../entities/bank_auto.entity';
import { Account } from '../entities/account.entity';
import { Order } from '../entities/order.entity';
import axios from 'axios';

export interface TransactionDetails {
  transactionContent: string;
  transactionAmount: number;
  transactionId: number;
  transactionDate: string;
  transactionTime: string;
}

@Injectable()
export class BankService {
  private readonly logger = new Logger(BankService.name);

  constructor(
    @InjectRepository(BankAuto)
    private readonly bankAutoRepository: Repository<BankAuto>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getTransactionsByUser(userId: number) {
    const transactions = await this.bankAutoRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    return transactions;
  }

  async getAllTransactions() {
    return await this.bankAutoRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async fetchTransactions(): Promise<TransactionDetails[]> {
    const url =
      'https://dichvuapi.com/historyACB/Cuong@699630/0865811722/AizRHXMfuGVf-XPJlxM-EfHh-VhxG-dLhw';
    try {
      const res = await axios.get(url);
      if (res.data.status === 'success') {
        return res.data.transactions
          .filter((tx) => tx.type === 'IN')
          .map((tx) => ({
            transactionContent: tx.description,
            transactionAmount: tx.amount,
            transactionId: tx.transactionID,
            transactionDate: tx.transactionDate,
            transactionTime: '',
          }));
      }
      return [];
    } catch (err) {
      this.logger.error('Lỗi fetch transactions', err);
      return [];
    }
  }

  async processTransactions() {
    const transactions = await this.fetchTransactions();

    for (const tx of transactions) {
      const existing = await this.bankAutoRepository.findOne({
        where: { transaction_id: tx.transactionId },
      });
      if (existing) {
        this.logger.log(`Transaction ${tx.transactionId} đã xử lý, bỏ qua`);
        continue;
      }

      let userId: number | null = null;
      let orderCode: string | null = null;

      const matchVietcod = tx.transactionContent.match(/vietcod(\d+)/i);
      if (matchVietcod) {
        userId = parseInt(matchVietcod[1], 10);
      }

      const matchCode = tx.transactionContent.match(/([A-Z0-9]{6,})/i);
      if (matchCode) {
        orderCode = matchCode[1];
      }

      let order: Order | null = null;
      if (orderCode) {
        order = await this.orderRepository.findOne({
          where: { code: orderCode },
        });
        if (order) {
          if (order.status === 'success') {
            this.logger.log(`Order ${order.code} đã success, bỏ qua`);
            continue;
          }
          userId = order.user_id;
        }
      }

      if (!userId) {
        this.logger.warn(
          `Không xác định được user_id cho transaction ${tx.transactionId}, bỏ qua`,
        );
        continue;
      }

      const account = await this.accountRepository.findOne({
        where: { id: userId },
      });
      if (!account) {
        this.logger.warn(`Không tìm thấy user với id ${userId}`);
        continue;
      }

      let amountToAdd = tx.transactionAmount;

      if (order && order.status === 'pending') {
        if (tx.transactionAmount >= order.price) {
          order.status = 'success';
          await this.orderRepository.save(order);
          this.logger.log(`Order ${order.code} đã được cập nhật thành success`);

          if (tx.transactionAmount > order.price) {
            const excess = tx.transactionAmount - order.price;
            amountToAdd = excess;
          } else {
            amountToAdd = 0;
          }
        } else {
          this.logger.log(
            `Transaction ${tx.transactionId} nhỏ hơn order ${order.code}, bỏ qua`,
          );
          continue;
        }
      }

      if (amountToAdd > 0) {
        account.vnd += amountToAdd;
        await this.accountRepository.save(account);
      }

      // Lưu transaction vào bank_auto
      const bankRecord = this.bankAutoRepository.create({
        description:
          amountToAdd < tx.transactionAmount
            ? `${tx.transactionContent} +  ${amountToAdd} VND tiền thừa`
            : tx.transactionContent,
        amount: tx.transactionAmount,
        user_id: userId,
        transaction_id: tx.transactionId,
      });
      await this.bankAutoRepository.save(bankRecord);

      this.logger.log(
        `Transaction ${tx.transactionId} đã xử lý: cộng ${amountToAdd} vào user ${userId}, lưu bank_auto`,
      );

      // Nếu tiền thừa, tạo record riêng trong bank_auto
      if (order && tx.transactionAmount > order.price) {
        const excess = tx.transactionAmount - order.price;
        account.vnd += excess;
        await this.accountRepository.save(account);

        const excessRecord = this.bankAutoRepository.create({
          description: `Tiền thừa từ transaction ${tx.transactionId} cho order ${order.code}`,
          amount: excess,
          user_id: userId,
          transaction_id: tx.transactionId,
        });
        await this.bankAutoRepository.save(excessRecord);

        this.logger.log(
          `Đã xử lý tiền thừa ${excess} cho user ${userId}, order ${order.code}`,
        );
      }
    }
  }
}
