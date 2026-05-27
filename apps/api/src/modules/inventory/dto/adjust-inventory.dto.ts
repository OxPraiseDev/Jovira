import { IsInt, IsString } from 'class-validator';

export class AdjustInventoryDto {
  @IsString()
  warehouseId: string;

  @IsString()
  skuVariationId: string;

  @IsInt()
  availableQty: number;
}