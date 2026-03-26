import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { unlinkSync, existsSync, mkdirSync } from 'fs';
import { ConfigService } from 'src/services/config.service';
import { CreateConfigDto } from '../dto/create/create-config.dto';
import { UpdateConfigDto } from '../dto/update/update-config.dto';
import { Config } from 'src/entities/config.entity';
import { JwtAuthGuard } from 'src/middlewares/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/auth/roles.guard';
import { Roles } from 'src/middlewares/auth/roles.decorator';

@Controller('config')
export class ConfigController {
  constructor(private readonly ConfigService: ConfigService) {}

  @Get('lang/:lang')
  findAllByLang(@Param('lang') lang: string): Promise<Config[]> {
    return this.ConfigService.findAllByLang(lang);
  }

  @Get()
  findAll(): Promise<Config[]> {
    return this.ConfigService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Config> {
    return this.ConfigService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createConfigDto: CreateConfigDto): Promise<Config> {
    return this.ConfigService.create(createConfigDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConfigDto: UpdateConfigDto,
  ): Promise<Config> {
    return this.ConfigService.update(id, updateConfigDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ConfigService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          /**
           * SỬA ĐỔI: Lưu vào thư mục 'uploads/items' nằm ở gốc project BE
           * process.cwd() lấy đường dẫn gốc của project chạy node
           */
          const uploadPath = join(process.cwd(), 'uploads', 'items');

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const randomName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `${randomName}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { success: false, message: 'Không tìm thấy file' };
    }

    /**
     * SỬA ĐỔI: Trả về đường dẫn tương đối để FE sử dụng qua Static Serve của BE
     * Đường dẫn này sẽ map với prefix chúng ta cấu hình ở bước 2
     */
    const filePath = `/uploads/items/${file.filename}`;

    return {
      success: true,
      message: 'Tải lên thành công',
      filePath,
    };
  }

  @Post('delete-file')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteFile(@Body('filePath') filePath: string) {
    /**
     * SỬA ĐỔI: Xóa file dựa trên thư mục gốc của BE
     */
    const fullPath = join(process.cwd(), filePath);

    try {
      if (existsSync(fullPath)) {
        unlinkSync(fullPath);
        return { success: true };
      }
      return { success: false, message: 'File không tồn tại' };
    } catch (err) {
      console.error('Xóa file thất bại:', err);
      return { success: false };
    }
  }
}
