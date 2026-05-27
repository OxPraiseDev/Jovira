import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommissionConfigService } from './commission-config.service';

@Controller('admin/commission')
export class CommissionConfigController {
  constructor(private readonly commissionService: CommissionConfigService) {}

  @Post()
  create(@Body() body: any) {
    return this.commissionService.create(body);
  }

  @Get()
  findAll() {
    return this.commissionService.findAll();
  }

  @Get('calculate')
  calculate(@Query('orderId') orderId: string, @Query('vendorId') vendorId: string) {
    return this.commissionService.calculateCommission(orderId, vendorId);
  }
}