import { Module } from '@nestjs/common';
import { SkuVariationsController } from './sku-variations.controller';
import { SkuVariationsService } from './sku-variations.service';

@Module({
  controllers: [SkuVariationsController],
  providers: [SkuVariationsService],
  exports: [SkuVariationsService],
})
export class SkuVariationsModule {}