import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderTimelineService } from '../order-timeline/order-timeline.service';
import { VendorOrdersService } from '../vendor-orders/vendor-orders.service';

@Injectable()
export class FulfillmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly timelineService: OrderTimelineService,
    private readonly vendorOrdersService: VendorOrdersService,
  ) {}

  async progressOrder(orderId: string, status: string) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    await this.timelineService.add(orderId, status);

    if (status === 'DELIVERED') {
      // trigger escrow release logic later
    }
  }

  async createVendorOrdersForOrder(orderId: string) {
    // placeholder: in real flow, split items by vendor
    const vendorId = 'vendor-1';
    return this.vendorOrdersService.createForOrder(orderId, vendorId);
  }
}