import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ChapaModule } from 'chapa-nestjs';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
     ChapaModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secretKey: configService.get<string>('chapa.secretKey')!,
      })
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.SECRET'),
        signOptions: { expiresIn: '1d' } // Set token expiration
      }),
      global: true,
      inject: [ConfigService],
    }),
    AuthModule, 
    UserModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true, 
      cache: true,
      load: [config]
    }),
    OrderModule,
    OrderItemModule,
    AnalyticsModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
