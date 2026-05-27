import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('preview')
  preview(@Query('userId') userId: string) {
    return this.checkoutService.preview(userId);
  }

  @Post()
  placeOrder(@Body() dto: CheckoutDto) {
    return this.checkoutService.placeOrder(dto);
  }
}