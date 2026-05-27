import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { VendorOrdersService } from './vendor-orders.service';

@Controller('vendor-orders')
export class VendorOrdersController {
  constructor(private readonly vendorOrdersService: VendorOrdersService) {}

  @Post()
  createForOrder() {
    // This should be called after payment success
    return { message: 'Vendor order creation triggered' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorOrdersService.findByOrder(id);
  }

  @Patch(':id/accept')
  accept(@Param('id') id: string) {
    return this.vendorOrdersService.accept(id);
  }

  @Patch(':id/ship')
  ship(@Param('id') id: string) {
    return this.vendorOrdersService.ship(id);
  }
}