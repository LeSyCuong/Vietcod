import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './modules/account.module';
import { ChatBotModule } from './modules/chatbot.module';
import { AuthModule } from './modules/auth.module';
import { ConTactModule } from './modules/contact.module';
import { JwtMiddleware } from './common/middleware/jwt.middleware';
import { CsrfMiddleware } from './common/middleware/csrf.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { IpWhitelistMiddleware } from './common/middleware/ip-whitelist.middleware';
import { CronModule } from './modules/cron_bank.module';
import { OrderModule } from './modules/order.module';
import { CompanyInfoModule } from './modules/company-info.module';
import { ChatbotHistoryModule } from './modules/chatbot-history.module';
import { ConfigWebModule } from './modules/config.module';
import { SanphamGameModule } from './modules/sanpham_game.module';
import { BankModule } from './modules/bank_auto.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    CronModule,
    AccountModule,
    ChatBotModule,
    AuthModule,
    ConTactModule,
    OrderModule,
    CompanyInfoModule,
    ChatbotHistoryModule,
    ConfigWebModule,
    SanphamGameModule,
    BankModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const jwtRoutes = ['/account/change-password'];
    const csrfRoutes = ['/account/change-password'];
    const ipWhiteList = ['/admin', '/account/update', '/account/delete'];

    consumer.apply(JwtMiddleware).forRoutes(...jwtRoutes);
    consumer.apply(CsrfMiddleware).forRoutes(...csrfRoutes);
    consumer.apply(IpWhitelistMiddleware).forRoutes(...ipWhiteList);
  }
}
