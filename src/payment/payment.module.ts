import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { OrderModule } from 'src/order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/order/order.model';

@Module({
  imports: [
    OrderModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
