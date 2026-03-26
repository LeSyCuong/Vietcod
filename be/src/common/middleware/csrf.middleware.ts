import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const csrfCookie = req.cookies['csrf_token'];
    const csrfHeader = req.headers['x-csrf-token'];

    if (!csrfCookie || !csrfHeader) {
      throw new UnauthorizedException('CSRF token không hợp lệ');
    }

    if (csrfCookie !== csrfHeader) {
      throw new UnauthorizedException('CSRF token không hợp lệ');
    }

    next();
  }
}
