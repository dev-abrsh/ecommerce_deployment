import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand, BrandSchema } from './brand.model';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  providers: [BrandService],
  controllers: [BrandController],
   imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],

})
export class BrandModule {}
