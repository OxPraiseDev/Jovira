import { Module } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';
import { OrderTimelineModule } from '../order-timeline/order-timeline.module';
import { VendorOrdersModule } from '../vendor-orders/vendor-orders.module';

@Module({
  imports: [OrderTimelineModule, VendorOrdersModule],
  providers: [FulfillmentService],
  exports: [FulfillmentService],
})
export class FulfillmentModule {}