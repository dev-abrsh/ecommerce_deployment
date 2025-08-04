import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../category/category.model';
import { Brand } from '../brand/brand.model';


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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
   category_id: MongooseSchema.Types.ObjectId;

   @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand', required: true })
    brand_id: MongooseSchema.Types.ObjectId;

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
  created_by: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
