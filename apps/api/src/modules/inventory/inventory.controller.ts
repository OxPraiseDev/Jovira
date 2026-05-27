import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('adjust')
  setStock(@Body() dto: AdjustInventoryDto) {
    return this.inventoryService.setStock(dto);
  }

  @Get('sku/:skuVariationId')
  findBySku(@Param('skuVariationId') skuVariationId: string) {
    return this.inventoryService.findBySku(skuVariationId);
  }
}