import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RefundsService } from './refunds.service';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post()
  create(@Body() body: any) {
    return this.refundsService.create(body);
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.refundsService.findByOrder(orderId);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.refundsService.approve(id);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.refundsService.reject(id);
  }

  @Post(':id/process')
  process(@Param('id') id: string) {
    return this.refundsService.process(id);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string) {
    return this.refundsService.complete(id);
  }
}