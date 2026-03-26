// src/common/middleware/jwt.middlware.ts

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const cookies = req.cookies;

    const accessToken = cookies['access_token'];

    if (!accessToken) {
      return res.status(401).json({
        message: 'Không có access token trong cookies',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      req['user'] = payload;

      if (!payload?.sub) {
        throw new UnauthorizedException('Token không hợp lệ');
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({
        message: 'Token không hợp lệ hoặc hết hạn',
        error: err.message,
      });
    }

    next();
  }
}
