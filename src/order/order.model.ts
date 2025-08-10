import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'OrderItem' }], default: [] })
  order_items: Types.ObjectId[];

  @Prop({ default: 'pending' })
  status: string; // pending, shipped, delivered, canceled

  @Prop()
  payment_reference?: string;

  @Prop({ required: true })
  total_price: number;

  @Prop({ default: 'pending' })
  payment_status?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
