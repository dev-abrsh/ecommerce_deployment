import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
	
  @IsString()
  @IsNotEmpty()
  status: string;
}
