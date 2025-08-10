import {
  IsArray,
  ArrayNotEmpty,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true }) // validate each element in array is a valid ObjectId
  order_items: string[];

  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @IsOptional()
  @IsString()
  payment_status?: string;
}
