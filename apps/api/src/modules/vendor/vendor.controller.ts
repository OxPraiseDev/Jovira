import { Controller, Get, Param } from '@nestjs/common';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get('profile/:userId')
  getProfile(@Param('userId') userId: string) {
    return this.vendorService.getProfile(userId);
  }

  @Get('stats/:vendorId')
  getStats(@Param('vendorId') vendorId: string) {
    return this.vendorService.getStats(vendorId);
  }
}