import { Module } from '@nestjs/common';
import { VendorOrdersController } from './vendor-orders.controller';
import { VendorOrdersService } from './vendor-orders.service';

@Module({
  controllers: [VendorOrdersController],
  providers: [VendorOrdersService],
  exports: [VendorOrdersService],
})
export class VendorOrdersModule {}