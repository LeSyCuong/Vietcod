// src/account/account.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { Account } from '../entities/account.entity';
import { Throttle } from '@nestjs/throttler';
import { UserDto } from 'src/dto/user.dto';
import { JwtAuthGuard } from 'src/middlewares/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/auth/roles.guard';
import { Roles } from 'src/middlewares/auth/roles.decorator';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUserById(@Param('id') id: number): Promise<UserDto> {
    return this.accountService.findUserById(id);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('forgot')
  async forgotPassword(@Body() body: { email: string }) {
    const { email } = body;

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const account = await this.accountService.resetPasswordByEmail(email);

    return {
      success: true,
      message: 'Đã gửi email khôi phục mật khẩu.',
      email: account.email,
    };
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email query parameter is required');
    }

    const account = await this.accountService.findByEmail(email);

    return {
      email: account.email,
    };
  }

  @Post('find-by-token')
  findByforgotToken(@Body('token') token: string): Promise<{ email: string }> {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    return this.accountService.findByforgotToken(token);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() body: { success: boolean; email: string; newPassword: string },
  ): Promise<{ success: boolean; status: number; message: string }> {
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return {
        success: false,
        status: 2,
        message: 'Email và mật khẩu mới là bắt buộc.',
      };
    }

    return this.accountService.changePassword(email, newPassword);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('reset-password-by-token')
  async resetPasswordByToken(
    @Body() body: { email: string; token: string; newPassword: string },
  ): Promise<{ status: number; message: string }> {
    const { email, token, newPassword } = body;

    if (!email || !token || !newPassword) {
      return {
        status: 0,
        message: 'Email, token và mật khẩu mới là bắt buộc.',
      };
    }

    return this.accountService.resetPasswordByToken(email, token, newPassword);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<{ success: boolean; data: Account[] }> {
    const data = await this.accountService.findAll();
    return {
      success: true,
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: number): Promise<Account> {
    return this.accountService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() body: Partial<Account>): Promise<Account> {
    return this.accountService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: number,
    @Body() body: Partial<Account>,
  ): Promise<Account> {
    return this.accountService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: number): Promise<void> {
    return this.accountService.delete(+id);
  }
}
