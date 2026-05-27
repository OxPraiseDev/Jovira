import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.customersService.findOne(userId);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Post(':userId/loyalty')
  updateLoyalty(@Param('userId') userId: string, @Body() body: { points: number }) {
    return this.customersService.updateLoyaltyPoints(userId, body.points);
  }
}