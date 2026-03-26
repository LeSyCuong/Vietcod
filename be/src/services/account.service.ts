// src/account/account.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dto/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async findAll(): Promise<Account[]> {
    const accounts = await this.accountRepository.find();
    return plainToInstance(Account, accounts);
  }

  async findOne(id: number): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return account;
  }

  async findUserById(id: number): Promise<UserDto> {
    const account = await this.accountRepository.findOne({ where: { id } });

    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }

    const accountResponseDto: UserDto = {
      id: account.id,
      username: account.username,
      email: account.email,
      phone: account.phone,
      role: account.role,
      vnd: account.vnd,
    };

    return accountResponseDto;
  }

  async findByEmail(email: string): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { email } });
    if (!account) {
      throw new NotFoundException(`Account with email "${email}" not found`);
    }
    return account;
  }

  async findByforgotToken(token: string): Promise<{ email: string }> {
    const account = await this.accountRepository.findOne({
      where: { forgotToken: token },
    });

    if (!account) {
      throw new NotFoundException(`Account with token "${token}" not found`);
    }

    return {
      email: account.email,
    };
  }

  async changePassword(
    email: string,
    newPassword: string,
  ): Promise<{ success: boolean; status: number; message: string }> {
    const account = await this.accountRepository.findOne({ where: { email } });

    if (!account) {
      return {
        success: false,
        status: 1,
        message: 'Tài khoản không tồn tại.',
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        status: 2,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    account.password = hashedPassword;
    account.updatepass = new Date();

    await this.accountRepository.save(account);

    return {
      success: true,
      status: 0,
      message: 'Đổi mật khẩu thành công.',
    };
  }

  async resetPasswordByToken(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean; status: number; message: string }> {
    const account = await this.accountRepository.findOne({ where: { email } });

    if (!account) {
      return {
        success: false,
        status: 1,
        message: 'Tài khoản không tồn tại.',
      };
    }

    if (account.forgotToken !== token) {
      return {
        success: false,
        status: 2,
        message: 'Token không hợp lệ hoặc đã hết hạn.',
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        status: 3,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    account.password = hashedPassword;
    account.forgotToken = '';
    account.updatepass = new Date();

    await this.accountRepository.save(account);

    return {
      success: true,
      status: 0,
      message: 'Đổi mật khẩu thành công.',
    };
  }

  async findByUsername(username: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { username },
    });
    if (!account) {
      throw new NotFoundException(
        `Account with username ${username} not found`,
      );
    }
    return account;
  }

  async create(account: Partial<Account>): Promise<Account> {
    const newAccount = this.accountRepository.create(account);

    if (account.password) {
      const hashed = await bcrypt.hash(account.password, 12);
      newAccount.password = hashed;
      newAccount.updatepass = new Date();
    }

    return await this.accountRepository.save(newAccount);
  }

  async update(id: number, updateData: Partial<Account>): Promise<Account> {
    const existing = await this.accountRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }

    // Nếu gửi lên password mới → hash lại
    if (updateData.password) {
      if (updateData.password.length < 6) {
        throw new BadRequestException('Mật khẩu phải từ 6 ký tự trở lên.');
      }

      const hashed = await bcrypt.hash(updateData.password, 12);
      updateData.password = hashed;
      updateData.updatepass = new Date();
    } else {
      delete updateData.password; // tránh ghi đè null
    }

    const updated = this.accountRepository.merge(existing, updateData);
    return this.accountRepository.save(updated);
  }

  async delete(id: number): Promise<void> {
    await this.accountRepository.delete(id);
  }

  async resetPasswordByEmail(email: string): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { email } });
    if (!account) {
      throw new NotFoundException(`Account with email "${email}" not found`);
    }

    const token = uuidv4();
    account.forgotToken = token;
    await this.accountRepository.save(account);

    const resetLink = `${process.env.CLIENT_URL}/pages/change?email=${email}&token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'Vietcod Technology',
      to: email,
      subject: 'Khôi phục mật khẩu từ Vietcod',
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e2e8f0;">
      <h2 style="color: #333; text-align: center;">Khôi phục mật khẩu</h2>
      <p>Xin chào,</p>
      <p>Bạn đã yêu cầu khôi phục mật khẩu tài khoản trên <strong>Vietcod</strong>.</p>
      <p>Nhấn vào nút bên dưới để đặt lại mật khẩu của bạn:</p>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetLink}" style="
          background-color: #2563eb;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: bold;
          display: inline-block;
          font-size: 16px;
        ">
          Đặt lại mật khẩu
        </a>
      </div>

      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      <p style="color: #6b7280; font-size: 12px;">Email này được gửi tự động từ hệ thống Vietcod. Vui lòng không trả lời lại.</p>
    </div>
  `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send reset password email:', error);
      throw new InternalServerErrorException(
        'Failed to send reset password email',
      );
    }

    return account;
  }
}
