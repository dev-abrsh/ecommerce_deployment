import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Order } from 'src/order/order.model';

@Schema({ timestamps: true })
export class Delivery extends Document {
  @Prop({ type: Types.ObjectId, ref: Order.name, required: true })
  order_id: Types.ObjectId;

  @Prop({ required: true })
  street_add: string;

  @Prop()
  street_add2?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop()
  home_no?: string;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
