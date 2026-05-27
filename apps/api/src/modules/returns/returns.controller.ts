import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReturnsService } from './returns.service';

@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  create(@Body() body: any) {
    return this.returnsService.create(body);
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.returnsService.findByOrder(orderId);
  }

  @Post(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; trackingNumber?: string }) {
    return this.returnsService.updateStatus(id, body.status, body.trackingNumber);
  }
}