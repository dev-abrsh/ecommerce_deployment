import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';

@Module({})
export class PaymentModule {
  controllers: [PaymentController];
}
