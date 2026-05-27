import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class SlaEnforcementJob {
  private readonly logger = new Logger(SlaEnforcementJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async enforceSla() {
    this.logger.log('Running SLA enforcement job');

    const now = new Date();

    // Find vendor orders that exceeded acceptance deadline
    const overdueAcceptance = await this.prisma.vendorOrder.findMany({
      where: {
        status: 'AWAITING_ACCEPTANCE',
        acceptDeadline: { lt: now },
      },
    });

    for (const vo of overdueAcceptance) {
      await this.cancelOrder(vo.orderId, 'VENDOR_TIMEOUT_ACCEPTANCE');
      await this.applyVendorPenalty(vo.vendorId);
    }

    // Find vendor orders that exceeded ship deadline
    const overdueShip = await this.prisma.vendorOrder.findMany({
      where: {
        status: 'ACCEPTED',
        shipDeadline: { lt: now },
        shipTimestamp: null,
      },
    });

    for (const vo of overdueShip) {
      await this.cancelOrder(vo.orderId, 'VENDOR_TIMEOUT_SHIP');
      await this.applyVendorPenalty(vo.vendorId);
    }

    this.logger.log(`SLA enforcement completed: ${overdueAcceptance.length + overdueShip.length} orders cancelled`);
  }

  private async cancelOrder(orderId: string, reason: string) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    await this.prisma.vendorOrder.updateMany({
      where: { orderId },
      data: { status: 'CANCELLED' },
    });

    this.logger.log(`Order ${orderId} cancelled due to ${reason}`);
  }

  private async applyVendorPenalty(vendorId: string) {
    // Add penalty logic here
    this.logger.log(`Penalty applied to vendor ${vendorId}`);
  }
}