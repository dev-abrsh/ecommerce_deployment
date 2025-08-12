import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateDeliveryDto {
  @IsNotEmpty()
  order_id: string;

  @IsNotEmpty()
  @IsString()
  street_add: string;

  @IsOptional()
  @IsString()
  street_add2?: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  home_no?: string;
}

export class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) {}
