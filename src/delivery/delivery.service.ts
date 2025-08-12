import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery } from './delivery.model';
import { CreateDeliveryDto } from './dto';
import { UpdateDeliveryDto } from './dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name) private readonly deliveryModel: Model<Delivery>,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    const delivery = await this.deliveryModel.create(createDeliveryDto);
    return delivery;
  }

  async findAll() {
    return this.deliveryModel.find().populate('order_id');
  }

  async findOne(id: string) {
    const delivery = await this.deliveryModel.findById(id).populate('order_id');
    if (!delivery)
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    return delivery;
  }

  async update(id: string, updateDeliveryDto: UpdateDeliveryDto) {
    const delivery = await this.deliveryModel.findByIdAndUpdate(
      id,
      updateDeliveryDto,
      { new: true },
    );
    if (!delivery)
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    return delivery;
  }

  async remove(id: string) {
    const delivery = await this.deliveryModel.findByIdAndDelete(id);
    if (!delivery)
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    return { message: 'Delivery deleted successfully', id };
  }
}
