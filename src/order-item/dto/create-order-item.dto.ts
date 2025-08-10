import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  // @IsMongoId()
  // @IsNotEmpty()
  // order_id: string;

  @IsMongoId()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0, { message: 'Price must be a non-negative number' })
  price: number;
}
