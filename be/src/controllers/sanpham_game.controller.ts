// src/sanpham_game/controllers/sanpham_game.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  UseGuards,
  Delete,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SanphamGameService } from '../services/sanpham_game.service';
import { CreateSanphamGameDto } from 'src/dto/create/create-sanpham_game.dto';
import { JwtAuthGuard } from '../middlewares/auth/jwt-auth.guard';
import { UpdateSanphamGameDto } from 'src/dto/update/update-sanpham_game.dto';
import { RolesGuard } from 'src/middlewares/auth/roles.guard';
import { Roles } from 'src/middlewares/auth/roles.decorator';

interface UpdateImagesDto {
  img?: string;
  img_demo?: string;
}

interface JwtPayload {
  sub: number;
  email?: string;
  [key: string]: any;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

@Controller('sanpham-game')
export class SanphamGameController {
  constructor(private readonly sanphamGameService: SanphamGameService) {}

  @Patch(':id/images')
  async updateImages(@Param('id') id: string, @Body() body: UpdateImagesDto) {
    return this.sanphamGameService.updateImages(+id, body.img, body.img_demo);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  async findAllAdmin(@Req() req: AuthRequest) {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('Bạn không có quyền admin');
    }
    return this.sanphamGameService.findAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/:id')
  async findOneAdmin(@Req() req: AuthRequest, @Param('id') id: string) {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('Bạn không có quyền admin');
    }
    return this.sanphamGameService.findAdmin(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createSanphamGameDto: CreateSanphamGameDto) {
    return this.sanphamGameService.create(createSanphamGameDto);
  }

  @Get()
  findAll(@Query('limit') limit?: string, @Query('desc') desc?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const parsedDesc = desc === 'true';
    return this.sanphamGameService.findAll(parsedLimit, parsedDesc);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sanphamGameService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-order/:orderId')
  async findByOrderId(
    @Req() req: AuthRequest,
    @Param('orderId') orderId: string,
  ) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User không hợp lệ');
    return this.sanphamGameService.findByOrderId(+orderId, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSanphamGameDto: UpdateSanphamGameDto,
  ) {
    return this.sanphamGameService.update(+id, updateSanphamGameDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sanphamGameService.remove(+id);
  }
}
