import { Module } from '@nestjs/common';
import { ProductModerationController } from './product-moderation.controller';
import { ProductModerationService } from './product-moderation.service';

@Module({
  controllers: [ProductModerationController],
  providers: [ProductModerationService],
  exports: [ProductModerationService],
})
export class ProductModerationModule {}