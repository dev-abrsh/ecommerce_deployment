import { IsString, IsNotEmpty ,IsOptional} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsOptional()
    @IsNotEmpty()
  name: string;
}