import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OrderItem } from './order-item.model';
import { Product } from 'src/products/products.model';
import { Model, Types } from 'mongoose';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectModel(OrderItem.name) private readonly orderItemModel: Model<OrderItem>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    const product = await this.productModel.findById(createOrderItemDto.product_id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const created = new this.orderItemModel(createOrderItemDto);
    return await created.save();
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    product_id?: string,
    startPrice?: number,
    endPrice?: number,
  ) {
    const skip = (page - 1) * pageSize;
    const filter: Record<string, any> = {};

    if (product_id) {
      filter.product_id = product_id;
    }

    if (startPrice !== undefined || endPrice !== undefined) {
      filter.price = {};
      if (startPrice !== undefined) filter.price.$gte = startPrice;
      if (endPrice !== undefined) filter.price.$lte = endPrice;
    }

    if (search) {
      filter.$or = [
        { price: { $regex: search, $options: 'i' } },
        { quantity: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      this.orderItemModel
        .find(filter)
        .populate('product_id')
        // .populate('order_id')
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.orderItemModel.countDocuments(filter),
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
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');

    const item = await this.orderItemModel.findById(id).populate('product_id').populate('order_id');
    if (!item) throw new NotFoundException('Order item not found');

    return item;
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');

    const updated = await this.orderItemModel
      .findByIdAndUpdate(id, updateOrderItemDto, { new: true })
      .populate('product_id')
      .populate('order_id');

    if (!updated) throw new NotFoundException('Order item not found');

    return updated;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');

    const deleted = await this.orderItemModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Order item not found');

    return { message: 'Order item deleted successfully' };
  }
}
