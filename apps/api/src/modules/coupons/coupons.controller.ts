import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  create(@Body() body: any) {
    return this.couponsService.create(body);
  }

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Post('validate')
  validate(@Body() body: { code: string; userId: string; orderAmount: number }) {
    return this.couponsService.validate(body.code, body.userId, body.orderAmount);
  }

  @Post('use')
  use(@Body() body: { couponId: string; userId: string; orderId: string }) {
    return this.couponsService.use(body.couponId, body.userId, body.orderId);
  }
}