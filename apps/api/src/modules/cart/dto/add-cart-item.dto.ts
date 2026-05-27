import { IsEnum, IsInt, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  userId: string;

  @IsString()
  skuVariationId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsEnum(['EXPRESS', 'DROPSHIP'] as any)
  fulfillmentType: 'EXPRESS' | 'DROPSHIP';
}