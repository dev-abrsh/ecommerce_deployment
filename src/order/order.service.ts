import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.model';
import { Model } from 'mongoose';
import { User } from 'src/user/user.model';
import { ChapaService } from 'chapa-nestjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderService {
    constructor(
      @InjectModel(Order.name) private readonly orderModel: Model<Order>,
      @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly configService: ConfigService,
        private readonly chapaService: ChapaService,
    ) {}
  async create(createOrderDto: CreateOrderDto) {
    const user=await this.userModel.findById(createOrderDto.user_id); 
    if(!user) throw new BadRequestException('User not found');
    
      // Create order first with pending status
    const order = await this.orderModel.create({
      ...createOrderDto,
      status: 'pending',
      payment_status: 'unpaid',
    });

    const tx_ref = await this.chapaService.generateTransactionReference();

    const response = await this.chapaService.initialize({
      first_name: user.name,
      last_name: 'Customer',
      email: user.email,
      currency: 'ETB',
      amount: order.total_price.toString(),
      tx_ref: tx_ref,
      callback_url: `${this.configService.get<string>('BASE_URL')}/payment/callback/${order._id}`,
      return_url:`https://www.google.com/`,
      // return_url: `${this.configService.get<string>('frontendUrl')}/order/confirmation/${order._id}`,
      customization: {
        title: 'Techify',
        description: `Payment for order ${order._id}`,
        // logo: '/asset/TechifyImageLogo.png',

      },
    });

    return {
    order,
    payment_url: response.data.checkout_url,
  };
  }

  async findAll(
    @Req() req: Request,
    status?:string,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    user_id?:string
  ) {
 const filter: any = {};

    if (status) filter.status = status;
    if (user_id) filter.user_id = user_id;
    if (search) {
      filter.$or = [
        { status: { $regex: search, $options: 'i' } },
        { payment_status: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * pageSize;

    const [items, totalItems] = await Promise.all([
      this.orderModel
        .find(filter)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate('user_id', 'name email'), // optional: populates user details
      this.orderModel.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
        pageSize,
      },
    };
  }

  async findOne(id: string) {
    const order = await this.orderModel
    .findById(id)
    .populate({
      path: 'order_items',
      populate: {
        path: 'product_id',
        model: 'Product'
      }
    })
    .populate('user_id');

    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, {
      new: true,
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return { message: 'Order deleted successfully', id };
  }
}