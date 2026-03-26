// src/order/order.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create/create-order.dto';
import { UpdateOrderDto } from '../dto/update/update-order.dto';
import { JwtAuthGuard } from 'src/middlewares/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/auth/roles.guard';
import { Roles } from 'src/middlewares/auth/roles.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);
    return {
      id: order.id,
      invoiceCode: order.code,
      price: order.price,
      name: order.name,
      status: order.status,
    };
  }

  @Post('payment/:id')
  async payment(@Param('id') id: string, @Body('userId') userId: number) {
    return this.orderService.payment(+id, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll() {
    return this.orderService.findAll();
  }

  @Get('user/:id')
  async findAllByUser(@Param('id') user_id: string) {
    return this.orderService.findAllByUser(+user_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Get('status/:invoiceCode')
  async checkPaymentStatus(
    @Param('invoiceCode') invoiceCode: string,
  ): Promise<any> {
    const order = await this.orderService.findOneByCode(invoiceCode);

    if (!order) {
      throw new Error('Order not found');
    }

    return {
      status: order.status,
      name: order.name,
      id: order.id,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
