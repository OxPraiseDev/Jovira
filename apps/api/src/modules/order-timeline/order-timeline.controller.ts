import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderTimelineService } from './order-timeline.service';

@Controller('order-timeline')
export class OrderTimelineController {
  constructor(private readonly timelineService: OrderTimelineService) {}

  @Post()
  add(@Body() body: { orderId: string; status: string; location?: string; note?: string }) {
    return this.timelineService.add(body.orderId, body.status, body.location, body.note);
  }

  @Get(':orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.timelineService.findByOrder(orderId);
  }
}