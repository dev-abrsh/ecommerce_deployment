import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsMongoId()
  @IsNotEmpty()
  category_id: string;

  @IsMongoId()
  @IsNotEmpty()
  brand_id: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  stock_quantity?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  ram?: string;

  @IsString()
  @IsOptional()
  storage?: string;

  @IsString()
  @IsOptional()
  processor?: string;

  @IsString()
  @IsOptional()
  screen_size?: string;

  @IsString()
  @IsOptional()
  battery?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  model_number?: string;

  @IsString()
  @IsOptional()
  warranty?: string;

  @IsString()
  @IsOptional()
  created_by?: string;
}

export class CreateProductWithImageDto extends CreateProductDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false})
  declare image: any;
}