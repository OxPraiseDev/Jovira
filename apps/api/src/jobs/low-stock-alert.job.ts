import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class LowStockAlertJob {
  private readonly logger = new Logger(LowStockAlertJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkLowStock() {
    this.logger.log('Running low-stock alert job');

    const lowStockItems = await this.prisma.productInventory.findMany({
      where: {
        availableQty: {
          lte: {
            gte: 0,
          },
        },
      },
    });

 
    this.logger.log(`Found ${lowStockItems.length} low-stock items`);

    for (const item of lowStockItems) {
      const sku = await this.prisma.skuVariation.findUnique({
        where: { id: item.skuVariationId },
      });

      if (sku && sku.lowStockThreshold > 0 && item.availableQty <= sku.lowStockThreshold) {
        this.logger.log(`LOW STOCK ALERT: SKU ${sku.sku} - ${item.availableQty} left`);
      }
    }
  }
}