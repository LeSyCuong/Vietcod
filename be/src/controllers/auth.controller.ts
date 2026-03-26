// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  UseGuards,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AccountDto } from '../dto/account.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../middlewares/auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { AccountService } from '../services/account.service';

interface JwtPayload {
  sub: number;
  email?: string;
  [key: string]: any;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('register')
  async register(
    @Body() dto: AccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: AccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('refresh-access')
  async refreshAccess(@Body('email') email: string) {
    return this.authService.sendActivationEmail(email, undefined, true);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('google-login')
  async googleLogin(
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.googleLogin(token, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User không hợp lệ');

    await this.authService.logout(userId, res);

    return { message: 'Đăng xuất thành công' };
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refresh_token;
    if (!token) throw new UnauthorizedException('Thiếu refresh token');
    return this.authService.refreshToken(token, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthRequest) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User không hợp lệ');

    const user = await this.accountService.findOne(userId);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      vnd: user.vnd,
    };
  }
}
