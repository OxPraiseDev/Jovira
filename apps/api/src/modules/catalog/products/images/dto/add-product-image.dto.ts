import { IsOptional, IsString, IsInt } from 'class-validator';

export class AddProductImageDto {
  @IsString()
  productId: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsInt()
  position?: number;
}