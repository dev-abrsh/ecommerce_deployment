import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './products.model';
import { Category, CategorySchema } from '../category/category.model';
import { Brand, BrandSchema } from '../brand/brand.model';
import { CategoryModule } from '../category/category.module';
import { BrandModule } from '../brand/brand.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [
  MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  CategoryModule,
  BrandModule,
  CloudinaryModule
],


})
export class ProductsModule {}
