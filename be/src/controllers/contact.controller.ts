// src/mail/ConTact.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ConTactService } from '../services/contact.service';
import { JwtAuthGuard } from 'src/middlewares/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/auth/roles.guard';
import { Roles } from 'src/middlewares/auth/roles.decorator';

interface ConTactRequest {
  email: string;
  user?: number;
  type: string;
  ip?: string;
  device?: string;
  name?: string;
  phone?: string;
  service?: string;
  message?: string;
}

interface ConTactResponse {
  success: boolean;
  message: string;
  code?: string;
  data?: any;
}

@Controller('contact')
export class ConTactController {
  constructor(private readonly ConTactService: ConTactService) {}

  @Post('send')
  async create(@Body() body: ConTactRequest): Promise<ConTactResponse> {
    try {
      const result = await this.ConTactService.create(body);
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          success: false,
          message: 'Lỗi hệ thống, vui lòng thử lại sau',
          code: 'SYSTEM_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllContacts(): Promise<ConTactResponse> {
    try {
      const result = await this.ConTactService.findAll();
      return {
        success: true,
        message: 'Lấy danh sách liên hệ thành công',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Lỗi khi lấy danh sách',
          code: 'GET_ALL_FAILED',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ConTactResponse> {
    try {
      const data = await this.ConTactService.findOne(id);
      return {
        success: true,
        message: 'Lấy thông tin liên hệ thành công',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          success: false,
          message: 'Không thể lấy thông tin liên hệ',
          code: 'GET_ONE_FAILED',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<ConTactRequest>,
  ): Promise<ConTactResponse> {
    try {
      const updated = await this.ConTactService.update(id, data);
      return {
        success: true,
        message: 'Cập nhật thành công',
        data: updated,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          success: false,
          message: 'Không thể cập nhật liên hệ',
          code: 'UPDATE_FAILED',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ConTactResponse> {
    try {
      const deleted = await this.ConTactService.remove(id);
      return {
        success: true,
        message: 'Xoá liên hệ thành công',
        data: deleted,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          success: false,
          message: 'Không thể xoá liên hệ',
          code: 'DELETE_FAILED',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
