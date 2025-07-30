// src/product/product.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  rating: number;

  @Prop({ required: true })
  category_id: string; // reference to Categories table

  @Prop({ required: true })
  brand_id: string; // reference to Brand table

  @Prop({ default: 0 })
  stock_quantity: number;

  @Prop()
  image_url: string;

  @Prop()
  ram: string;

  @Prop()
  storage: string;

  @Prop()
  processor: string;

  @Prop()
  screen_size: string;

  @Prop()
  battery: string;

  @Prop()
  color: string;

  @Prop()
  model_number: string;

  @Prop()
  warranty: string;

  @Prop()
  created_by: string; // User ID of creator (Admin)

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
