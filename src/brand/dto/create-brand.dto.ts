import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
  name: string;

}
