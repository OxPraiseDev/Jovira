import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SkuVariationsService } from './sku-variations.service';
import { CreateSkuVariationDto } from './dto/create-sku-variation.dto';

@Controller('sku-variations')
export class SkuVariationsController {
  constructor(private readonly skuVariationsService: SkuVariationsService) {}

  @Post()
  create(@Body() dto: CreateSkuVariationDto) {
    return this.skuVariationsService.create(dto);
  }

  @Get()
  findAll(@Query('productId') productId?: string) {
    return this.skuVariationsService.findAll(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skuVariationsService.findOne(id);
  }
}