import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create/create-order.dto';
import { UpdateOrderDto } from '../dto/update/update-order.dto';
import { Account } from '../entities/account.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { itemId, price, userId, name, status = 'pending' } = createOrderDto;

    const code = 'LSC' + Math.random().toString(36).substr(2, 7).toUpperCase();

    const order = this.orderRepository.create({
      code,
      price,
      user_id: userId,
      product_id: itemId,
      name,
      status,
    });

    return this.orderRepository.save(order);
  }
  public async sendEmail(
    email: string,
    subject: string,
    html: string,
  ): Promise<{ message: string }> {
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
      subject,
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
  async payment(orderId: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const user = await this.accountRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (order.status !== 'pending') {
      throw new BadRequestException('Order is not pending');
    }

    if (user.vnd >= order.price) {
      user.vnd -= order.price;
      await this.accountRepo.save(user);

      order.status = 'success';
      await this.orderRepository.save(order);

      // gửi email tới lesycuong692003@gmail.com
      const subject = `Thanh toán thành công đơn hàng: ${order.name}`;
      const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #333; text-align: center;">Thanh toán thành công</h2>
        <p>Khách hàng: <strong>${user.username}</strong></p>
        <p>Email: <strong>${user.email}</strong></p>
        <p>Phone: <strong>${user.phone}</strong></p>
        <p>Đơn hàng: <strong>${order.name}</strong></p>
        <p>Mã đơn: <strong>${order.code}</strong></p>
        <p>ID: <strong>${order.id}</strong></p>
        <p>Số tiền: <strong>${order.price.toLocaleString()} VND</strong></p>
        <p style="color: #6b7280; font-size: 12px;">Email này được gửi tự động từ hệ thống Vietcod. Vui lòng không trả lời lại.</p>
      </div>
    `;
      await this.sendEmail('lesycuong692003@gmail.com', subject, html);

      return {
        message: 'Thanh toán thành công bằng ví nội bộ',
        status: order.status,
        order,
      };
    } else {
      return {
        message: 'Không đủ tiền, vui lòng quét QR để thanh toán',
        status: order.status,
        order,
      };
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findAllByUser(user_id: number): Promise<Order[]> {
    const orders = await this.orderRepository.find({ where: { user_id } });

    if (orders.length === 0) {
      throw new NotFoundException(`No orders found for user ID ${user_id}`);
    }

    return orders;
  }

  async findOneByCode(code: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { code } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${code} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.orderRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
