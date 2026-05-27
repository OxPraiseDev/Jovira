import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('rate')
  createRate(@Body() body: any) {
    return this.shippingService.createRate(body);
  }

  @Get('zone/:zoneId')
  findByZone(@Param('zoneId') zoneId: string) {
    return this.shippingService.findByZone(zoneId);
  }

  @Get('calculate')
  calculate(
    @Query('baseFee') baseFee: number,
    @Query('perKgFee') perKgFee: number,
    @Query('weightKg') weightKg: number,
  ) {
    return this.shippingService.calculate(Number(baseFee), Number(perKgFee), Number(weightKg));
  }
}