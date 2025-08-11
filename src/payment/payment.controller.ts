import { Controller, Param, Post, Res, Query, Get, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/order/order.model';
import { OrderService } from 'src/order/order.service';

@Controller('payment')
export class PaymentController {
  constructor(      
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly orderService: OrderService) {}

  @Get('callback/:orderId')
  async chapaCallback(
    @Req() req: Request,
    @Param('orderId') orderId: string,
    @Query('status') status: string,
    @Query('trx_ref') trx_ref: string,
    @Query('ref_id') ref_id: string,
    @Res() res
  ) {
    console.log("orderId: ",orderId);
    console.log("status: ",status);
    console.log("trx_ref: ",trx_ref);
    console.log("ref_id: ",ref_id);
    if (status === 'success') {
      await this.orderService.update(orderId, {
        status: 'confirmed',
        payment_status: 'paid',
      });
    } else {
      await this.orderService.update(orderId, {
        payment_status: 'failed',
        status: 'cancelled',
      });
    }

    return res.status(200).send('Payment callback handled.');
  }

	@Get('verify')
	async verifyPayment(
		// @Query('orderId') orderId: string,
		@Query('tansactionId') transactionId: string,
		@Res() res) {
		const order = await this.orderModel.findOne({payment_reference: transactionId});
		return res.status(200).send(order);
	}
}
