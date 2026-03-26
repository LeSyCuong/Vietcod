import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConTact } from '../entities/contact.entity';
import * as nodemailer from 'nodemailer';

interface ConTactRequest {
  email: string;
  user?: number;
  type: string;
  ip?: string;
  device?: string;
  name?: string;
  phone?: string;
  message?: string;
  service?: string;
}

interface ConTactResponse {
  success: boolean;
  message: string;
  code?: string;
  data?: any;
}

@Injectable()
export class ConTactService {
  constructor(
    @InjectRepository(ConTact)
    private readonly ConTactRepository: Repository<ConTact>,
  ) {}

  async findLatestByUser(userId: number, type: string) {
    return this.ConTactRepository.findOne({
      where: { user: userId, type },
      order: { createdAt: 'DESC' },
    });
  }

  async updateContact(id: number, data: Partial<ConTact>) {
    await this.ConTactRepository.update(id, data);
    return this.ConTactRepository.findOne({ where: { id } });
  }
  async createContact(data: Partial<ConTact>) {
    const contact = this.ConTactRepository.create(data);
    return await this.ConTactRepository.save(contact);
  }

  async create(mailData: ConTactRequest): Promise<ConTactResponse> {
    const { email, type } = mailData;

    if (!type || !['submit', 'contact'].includes(type)) {
      throw new HttpException(
        {
          success: false,
          message: 'Loại yêu cầu không hợp lệ (type: contact hoặc submit)',
          code: 'INVALID_TYPE',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const emailValidation = this.validateEmail(email);
    if (!emailValidation.isValid) {
      throw new HttpException(
        {
          success: false,
          message: emailValidation.message,
          code: 'INVALID_EMAIL',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (type === 'submit') {
      const existing = await this.ConTactRepository.findOne({
        where: { email, type: 'submit' },
      });

      if (existing) {
        throw new HttpException(
          {
            success: false,
            message: 'Email này đã được đăng ký trước đó',
            code: 'EMAIL_EXISTS',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    if (mailData.ip) {
      const ipLimit = await this.checkRateLimit('ip', mailData.ip);
      if (!ipLimit.allowed) {
        throw new HttpException(
          {
            success: false,
            message: ipLimit.message,
            code: 'IP_RATE_LIMIT',
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    if (mailData.device) {
      const deviceLimit = await this.checkRateLimit('device', mailData.device);
      if (!deviceLimit.allowed) {
        throw new HttpException(
          {
            success: false,
            message: deviceLimit.message,
            code: 'DEVICE_RATE_LIMIT',
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    const newMail = this.ConTactRepository.create({
      ...mailData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      const savedMail = await this.ConTactRepository.save(newMail);
      this.sendEmail(email);

      return {
        success: true,
        message:
          type === 'contact'
            ? 'Thông tin liên hệ đã được gửi thành công!'
            : 'Đăng ký nhận bản tin thành công!',
        code: 'SUCCESS',
        data: {
          id: savedMail.id,
          email: savedMail.email,
          createdAt: savedMail.createdAt,
        },
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' && type === 'submit') {
        throw new HttpException(
          {
            success: false,
            message: 'Email này đã được đăng ký trước đó',
            code: 'EMAIL_EXISTS',
          },
          HttpStatus.CONFLICT,
        );
      }

      console.error('Database error:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Không thể lưu thông tin, vui lòng thử lại',
          code: 'DATABASE_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async sendEmail(email: string): Promise<{ message: string }> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Vietcod Technology" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Cảm ơn quý khách đã gửi thông tin liên hệ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h2 style="color: #333; text-align: center;">Chúng tôi sẽ liên hệ trong thời gian sớm nhất</h2>
          <p>Xin chào,</p>
          <p>Chúng tôi đã nhận được thông tin liên hệ từ bạn và sẽ phản hồi lại trong thời gian sớm nhất, trân trọng <strong>Vietcod</strong>.</p>
          <p style="color: #6b7280; font-size: 12px;">Email này được gửi tự động từ hệ thống Vietcod. Vui lòng không trả lời lại.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  private validateEmail(email: string): { isValid: boolean; message: string } {
    if (!email) {
      return {
        isValid: false,
        message: 'Email không được để trống',
      };
    }

    // Check email length
    if (email.length > 255) {
      return {
        isValid: false,
        message: 'Email quá dài (tối đa 255 ký tự)',
      };
    }

    // Check email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: 'Email không đúng định dạng',
      };
    }

    // Check for common invalid patterns
    const invalidPatterns = [
      /\.\./, // consecutive dots
      /^[.-]/, // starts with dot or dash
      /[.-]$/, // ends with dot or dash
      /@.*@/, // multiple @ symbols
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.test(email)) {
        return {
          isValid: false,
          message: 'Email không đúng định dạng',
        };
      }
    }

    return {
      isValid: true,
      message: 'Email hợp lệ',
    };
  }

  private async checkRateLimit(
    type: 'ip' | 'device',
    value: string,
  ): Promise<{ allowed: boolean; message: string }> {
    const now = new Date();
    const limits = {
      ip: {
        timeWindow: 60 * 60 * 1000, // 1 hour
        maxRequests: 5,
        message: 'IP của bạn đã vượt quá giới hạn đăng ký (5 lần/giờ)',
      },
      device: {
        timeWindow: 24 * 60 * 60 * 1000, // 24 hours
        maxRequests: 10,
        message: 'Thiết bị của bạn đã vượt quá giới hạn đăng ký (10 lần/ngày)',
      },
    };

    const limit = limits[type];
    const timeThreshold = new Date(now.getTime() - limit.timeWindow);

    const whereCondition =
      type === 'ip'
        ? { ip: value, createdAt: MoreThan(timeThreshold) }
        : { device: value, createdAt: MoreThan(timeThreshold) };

    const recentRequests = await this.ConTactRepository.count({
      where: whereCondition,
    });

    if (recentRequests >= limit.maxRequests) {
      return {
        allowed: false,
        message: limit.message,
      };
    }

    return {
      allowed: true,
      message: 'Trong giới hạn cho phép',
    };
  }

  // Optional: Method to get subscription statistics
  async getStats(): Promise<any> {
    const total = await this.ConTactRepository.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await this.ConTactRepository.count({
      where: { createdAt: MoreThan(today) },
    });

    return {
      total,
      today: todayCount,
    };
  }

  async findAll(): Promise<ConTact[]> {
    return this.ConTactRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<ConTact> {
    const contact = await this.ConTactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new HttpException(
        {
          success: false,
          message: 'Không tìm thấy liên hệ',
          code: 'NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return contact;
  }

  async update(id: number, data: Partial<ConTactRequest>): Promise<ConTact> {
    const contact = await this.findOne(id);
    Object.assign(contact, data, { updatedAt: new Date() });
    return this.ConTactRepository.save(contact);
  }

  async remove(id: number): Promise<ConTact> {
    const contact = await this.findOne(id);
    return this.ConTactRepository.remove(contact);
  }
}
