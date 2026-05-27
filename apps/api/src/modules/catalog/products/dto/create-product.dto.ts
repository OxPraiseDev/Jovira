import { IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  vendorId: string;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;
}