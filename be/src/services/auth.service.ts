// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { AccountDto } from '../dto/account.dto';
import { Response } from 'express';
import * as winston from 'winston';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private readonly jwtService: JwtService,
  ) {}

  private isProd = process.env.NODE_ENV === 'production';

  logger = winston.createLogger({
    transports: [
      new winston.transports.Console({ format: winston.format.simple() }),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
  });

  async setTokensCookies(res: Response, accountId: number) {
    const user = await this.accountRepo.findOne({
      where: { id: accountId },
    });

    if (!user) {
      throw new UnauthorizedException('User khĂ´ng tá»“n táº¡i');
    }

    const payload = { sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const rawRefreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );
    const csrfToken = this.jwtService.sign(
      { csrf: 'csrf' },
      { expiresIn: '1d' },
    );

    const hashedRefreshToken = await bcrypt.hash(rawRefreshToken, 12);

    await this.accountRepo.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    res.cookie('csrf_token', csrfToken, {
      httpOnly: false,
      secure: this.isProd ? true : false,
      sameSite: this.isProd ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.isProd ? true : false,
      sameSite: this.isProd ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', rawRefreshToken, {
      httpOnly: true,
      secure: this.isProd ? true : false,
      sameSite: this.isProd ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async refreshToken(token: string, res: Response) {
    try {
      const payload = this.jwtService.verify(token);

      if (!payload?.sub) {
        throw new UnauthorizedException('Payload khĂ´ng há»£p lá»‡');
      }

      const user = await this.accountRepo.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Token khĂ´ng há»£p lá»‡');
      }

      const valid = await bcrypt.compare(token, user.refreshToken);
      if (!valid) {
        throw new UnauthorizedException('Token khĂ´ng há»£p lá»‡');
      }

      await this.setTokensCookies(res, user.id);
      return { message: 'Token Ä‘Ă£ Ä‘Æ°á»£c lĂ m má»›i' };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token Ä‘Ă£ háº¿t háº¡n');
      }
      throw new UnauthorizedException('Token khĂ´ng há»£p lá»‡');
    }
  }

  async login(dto: AccountDto, res: Response) {
    const user = await this.accountRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      return {
        status: 1,
        success: false,
        message: 'TĂ i khoáº£n khĂ´ng tá»“n táº¡i',
      };
    }

    if (!user.password) {
      return {
        status: 2,
        success: false,
        message:
          'TĂ i khoáº£n nĂ y chÆ°a thiáº¿t láº­p máº­t kháº©u, vui lĂ²ng Ä‘Äƒng nháº­p báº±ng Google',
      };
    }

    if (user.accessToken) {
      return {
        status: 3,
        success: false,
        email: user.email,
        message:
          'TĂ i khoáº£n chÆ°a Ä‘Æ°á»£c kĂ­ch hoáº¡t, vui lĂ²ng kiá»ƒm tra há»™p thÆ° Ä‘á»ƒ kĂ­ch hoáº¡t tĂ i khoáº£n',
      };
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      return {
        status: 4,
        success: false,
        message: 'Máº­t kháº©u khĂ´ng Ä‘Ăºng',
      };
    }

    await this.setTokensCookies(res, user.id);

    return {
      status: 0,
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        vnd: user.vnd,
      },
    };
  }

  async logout(userId: number, res: Response) {
    await this.accountRepo.update(userId, { refreshToken: null });

    res.clearCookie('access_token', {
      path: '/',
      httpOnly: true,
      secure: this.isProd ? true : false,
      sameSite: this.isProd ? 'none' : 'strict',
    });
    res.clearCookie('refresh_token', {
      path: '/',
      httpOnly: true,
      secure: this.isProd ? true : false,
      sameSite: this.isProd ? 'none' : 'strict',
    });
    res.clearCookie('csrf_token', {
      path: '/',
      httpOnly: false,
      secure: this.isProd ? true : false,
      sameSite: this.isProd ? 'none' : 'strict',
    });

    return { message: 'Đăng xuất thành công' };
  }

  async register(dto: AccountDto, res: Response) {
    const existingUser = await this.accountRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser && existingUser.googleId && !existingUser.password) {
      const hashedPassword = await bcrypt.hash(dto.password, 12);
      const payload = { sub: existingUser.id, email: existingUser.email };
      const activationToken = this.jwtService.sign(payload, {
        expiresIn: '30m',
      });

      await this.accountRepo.update(existingUser.id, {
        password: hashedPassword,
        accessToken: activationToken,
      });

      await this.sendActivationEmail(existingUser.email, activationToken);

      return {
        status: 1,
        success: true,
        message:
          'Email nĂ y Ä‘Ă£ Ä‘Æ°á»£c Ä‘Äƒng nháº­p báº±ng Google, máº­t kháº©u cá»§a báº¡n Ä‘Ă£ Ä‘Æ°á»£c thiáº¿t láº­p. ChĂºng tĂ´i Ä‘Ă£ gá»­i email kĂ­ch hoáº¡t tĂ i khoáº£n.',
      };
    }

    if (existingUser) {
      return {
        status: 2,
        success: false,
        message: 'Email Ä‘Ă£ Ä‘Æ°á»£c sá»­ dá»¥ng',
      };
    }

    dto.password = await bcrypt.hash(dto.password, 12);
    const newUser = await this.accountRepo.save(this.accountRepo.create(dto));
    await this.setTokensCookies(res, newUser.id);

    return {
      status: 0,
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        vnd: newUser.vnd,
      },
    };
  }

  async sendActivationEmail(email: string, token?: string, auto = false) {
    if (auto) {
      const account = await this.accountRepo.findOne({ where: { email } });

      if (!account || !account.accessToken) {
        return {
          status: 1,
          success: false,
          message:
            'TĂ i khoáº£n Ä‘Ă£ Ä‘Æ°á»£c kĂ­ch hoáº¡t hoáº·c gáº·p lá»—i ká»¹ thuáº­t.',
        };
      }

      token = account.accessToken;
    }

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
      subject: 'KĂ­ch hoáº¡t tĂ i khoáº£n tá»« Vietcod',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #333; text-align: center;">KĂ­ch hoáº¡t tĂ i khoáº£n</h2>
        <p>Xin chĂ o,</p>
        <p>ChĂºng tĂ´i phĂ¡t hiá»‡n báº¡n Ä‘Ă£ Ä‘Äƒng nháº­p báº±ng Google trÆ°á»›c Ä‘Ă³.</p>
        <p>Hiá»‡n táº¡i báº¡n Ä‘ang dĂ¹ng Email nĂ y Ä‘á»ƒ Ä‘Äƒng kĂ½ thá»§ cĂ´ng.</p>
        <p>Vui lĂ²ng nháº¥n vĂ o liĂªn káº¿t sau Ä‘á»ƒ hoĂ n táº¥t Ä‘Äƒng kĂ½:</p>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="http://localhost/auth/success?accessToken=${token}" style="
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
            font-size: 16px;
          ">
            KĂ­ch hoáº¡t
          </a>
        </div>

        <p>Náº¿u báº¡n khĂ´ng yĂªu cáº§u, hĂ£y bá» qua email nĂ y.</p>
        <p style="color: #6b7280; font-size: 12px;">Email nĂ y Ä‘Æ°á»£c gá»­i tá»± Ä‘á»™ng tá»« há»‡ thá»‘ng Vietcod. Vui lĂ²ng khĂ´ng tráº£ lá»i láº¡i.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 0,
      success: true,
      message: 'Email kĂ­ch hoáº¡t Ä‘Ă£ Ä‘Æ°á»£c gá»­i thĂ nh cĂ´ng.',
    };
  }

  async googleLogin(token: string, res: Response) {
    let data;
    try {
      const result = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      data = result.data;
    } catch {
      throw new UnauthorizedException('Google token khĂ´ng há»£p lá»‡');
    }

    if (!data.email)
      throw new BadRequestException('Email khĂ´ng cĂ³ trong Google');

    let user = await this.accountRepo.findOne({ where: { email: data.email } });

    if (!user) {
      try {
        user = await this.accountRepo.save(
          this.accountRepo.create({
            email: data.email.toLowerCase(),
            username: data.name || data.email.split('@')[0],
            googleId: data.id.toString(),
            role: 'user',
          }),
        );
      } catch (err) {
        console.error('GOOGLE CREATE USER ERROR:', err);
        throw new InternalServerErrorException(
          'Lỗi tạo tài khoản Google: ' + err?.detail || err?.message,
        );
      }
    }

    await this.setTokensCookies(res, user.id);

    return {
      status: 0,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
