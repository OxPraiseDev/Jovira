import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductModerationService } from './product-moderation.service';

@Controller('admin/moderation')
export class ProductModerationController {
  constructor(private readonly moderationService: ProductModerationService) {}

  @Get('queue')
  getQueue() {
    return this.moderationService.getQueue();
  }

  @Post('review')
  review(@Body() body: { productId: string; status: 'APPROVED' | 'REJECTED' | 'BLOCKED'; reviewedBy: string; reason?: string }) {
    return this.moderationService.review(body.productId, body.status, body.reviewedBy, body.reason);
  }

  @Post('flag')
  flag(@Body() body: { productId: string; flaggedBy: string; reason: string }) {
    return this.moderationService.flag(body.productId, body.flaggedBy, body.reason);
  }
}