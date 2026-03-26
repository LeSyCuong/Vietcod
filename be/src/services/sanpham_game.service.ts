// src/sanpham_game/services/sanpham_game.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SanphamGame } from 'src/entities/sanpham_game.entity';
import { Order } from 'src/entities/order.entity';
import { CreateSanphamGameDto } from 'src/dto/create/create-sanpham_game.dto';
import { UpdateSanphamGameDto } from 'src/dto/update/update-sanpham_game.dto';

@Injectable()
export class SanphamGameService {
  constructor(
    @InjectRepository(SanphamGame)
    private readonly repo: Repository<SanphamGame>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  create(dto: CreateSanphamGameDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async updateImages(id: number, img?: string, img_demo?: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    const updated: Partial<SanphamGame> = {};
    if (img !== undefined) updated.img = img;
    if (img_demo !== undefined) updated.img_demo = img_demo;

    await this.repo.update(id, updated);
    return this.repo.findOne({ where: { id } });
  }

  async findAdmin(id?: number) {
    if (id) {
      const product = await this.repo.findOne({
        where: { id },
        select: [
          'id',
          'name',
          'img',
          'img_demo',
          'price',
          'category',
          'content',
          'link_youtube',
          'link_source',
          'link_view',
        ],
      });
      if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
      return product;
    }

    return this.repo.find({
      select: [
        'id',
        'name',
        'img',
        'img_demo',
        'price',
        'category',
        'content',
        'link_youtube',
        'link_source',
        'link_view',
      ],
      order: { id: 'DESC' },
    });
  }

  async findAll(limit?: number, desc: boolean = false) {
    return this.repo.find({
      select: [
        'id',
        'name',
        'img',
        'price',
        'category',
        'content',
        'link_youtube',
      ],
      order: { id: desc ? 'DESC' : 'ASC' },
      take: limit || undefined,
    });
  }

  async findOne(id: number) {
    return this.repo.findOne({
      select: [
        'id',
        'name',
        'img',
        'img_demo',
        'price',
        'content',
        'category',
        'link_youtube',
      ],
      where: { id },
    });
  }

  async findByOrderId(orderId: number, userId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Order không tồn tại');
    }

    if (order.user_id !== userId) {
      throw new UnauthorizedException('Bạn không có quyền xem đơn hàng này');
    }

    if (order.status === 'pending') {
      throw new BadRequestException('Sản phẩm chưa thanh toán');
    }

    const product = await this.repo.findOne({
      select: [
        'id',
        'name',
        'img',
        'price',
        'content',
        'category',
        'link_youtube',
        'link_source',
      ],
      where: { id: order.product_id },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    return product;
  }

  update(id: number, dto: UpdateSanphamGameDto) {
    return this.repo.update(id, dto);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
