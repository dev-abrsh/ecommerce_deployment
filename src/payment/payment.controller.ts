import { Controller, Param, Post, Res, Query, Get } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly orderService: OrderService) {}

  @Post('callback/:orderId')
  async chapaCallback(
    @Param('orderId') orderId: string,
    @Query('status') status: string,
    @Res() res
  ) {
    if (status === 'success') {
      await this.orderService.update(orderId, {
        status: 'confirmed',
        payment_status: 'paid',
      });
    } else {
      await this.orderService.update(orderId, {
        payment_status: 'failed',
      });
    }

    return res.status(200).send('Payment callback handled.');
  }

	@Get('verify')
	async verifyPayment(
		@Query('orderId') orderId: string,
		@Query('tansactionId') transactionId: string,
		@Res() res) {
		const order = await this.orderService.findOne(orderId);
		return res.status(200).send(order);
	}
}
