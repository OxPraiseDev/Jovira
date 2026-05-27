import { Module } from '@nestjs/common';
import { OrderTimelineController } from './order-timeline.controller';
import { OrderTimelineService } from './order-timeline.service';

@Module({
  controllers: [OrderTimelineController],
  providers: [OrderTimelineService],
  exports: [OrderTimelineService],
})
export class OrderTimelineModule {}