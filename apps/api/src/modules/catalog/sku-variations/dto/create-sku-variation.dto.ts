import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSkuVariationDto {
  @IsString()
  productId: string;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  dimensionsJson?: any;
}