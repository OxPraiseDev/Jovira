import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ShippingZonesService } from './shipping-zones.service';

@Controller('shipping-zones')
export class ShippingZonesController {
  constructor(private readonly shippingZonesService: ShippingZonesService) {}

  @Post()
  create(@Body() body: any) {
    return this.shippingZonesService.create(body);
  }

  @Get('route')
  findByRoute(
    @Query('fromCityId') fromCityId: string,
    @Query('toCityId') toCityId: string,
  ) {
    return this.shippingZonesService.findByRoute(fromCityId, toCityId);
  }
}