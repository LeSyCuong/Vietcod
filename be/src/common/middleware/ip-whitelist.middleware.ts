// src/common/middleware/ip-whitelist.middleware.ts
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  private readonly whitelist = [
    '127.0.0.1',
    '::1',
    '192.168.1.100',
    '::ffff:192.168.1.100',
  ];

  use(req: Request, res: Response, next: NextFunction) {
    // Lấy IP từ x-forwarded-for nếu dùng proxy, hoặc từ req.ip
    const forwarded = req.headers['x-forwarded-for'];
    const rawIp =
      (typeof forwarded === 'string' ? forwarded.split(',')[0] : null) ||
      req.socket.remoteAddress ||
      req.ip ||
      '';

    // Chuyển ::ffff:192.168.1.1 → 192.168.1.1
    const normalizedIp = rawIp.replace(/^::ffff:/, '');

    console.log(`🛡️ Checking IP: ${normalizedIp}`);

    if (!this.whitelist.includes(normalizedIp)) {
      throw new ForbiddenException(
        `IP ${normalizedIp} không được phép truy cập`,
      );
    }

    next();
  }
}
