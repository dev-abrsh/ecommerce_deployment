import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  status: string;

  @Prop()
  payment_reference?: string;

  @Prop({ required: true })
  total_price: number;

  @Prop({ default: 'pending' }) // or enum: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_status?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
