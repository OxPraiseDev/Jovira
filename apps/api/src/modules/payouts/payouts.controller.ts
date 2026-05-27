import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PayoutsService } from './payouts.service';

@Controller('payouts')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Post('request')
  requestPayout(@Body() body: { vendorId: string; amount: number; method: string; bankDetails: any }) {
    return this.payoutsService.requestPayout(body.vendorId, body.amount, body.method, body.bankDetails);
  }

  @Get()
  findAll(@Body('vendorId') vendorId?: string) {
    return this.payoutsService.findAll(vendorId);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.payoutsService.approve(id);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string) {
    return this.payoutsService.complete(id);
  }
}