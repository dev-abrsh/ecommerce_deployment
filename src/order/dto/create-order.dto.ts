import {
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

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @IsOptional()
  @IsString()
  payment_status?: string;

}
