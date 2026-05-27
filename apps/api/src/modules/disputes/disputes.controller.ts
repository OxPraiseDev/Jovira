import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DisputesService } from './disputes.service';

@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  create(@Body() body: any) {
    return this.disputesService.create(body);
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.disputesService.findByOrder(orderId);
  }

  @Post(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.disputesService.updateStatus(id, body.status);
  }
}