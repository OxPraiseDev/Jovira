import { IsInt, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  warehouseId: string;

  @IsString()
  skuVariationId: string;

  @IsInt()
  quantity: number;

  @IsInt()
  ttlMinutes: number;
}