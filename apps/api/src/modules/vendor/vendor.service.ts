import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.vendorProfile.findUnique({
      where: { userId },
      include: {
        vendorOrders: true,
        kycDocuments: true,
      },
    });
  }

  async getStats(vendorId: string) {
    const [totalOrders, totalRevenue, pendingOrders] = await Promise.all([
      this.prisma.vendorOrder.count({ where: { vendorId } }),
      this.prisma.vendorOrder.aggregate({
        where: { vendorId },
        _sum: { orderId: true }, // Simplified
      }),
      this.prisma.vendorOrder.count({
        where: { vendorId, status: 'AWAITING_ACCEPTANCE' },
      }),
    ]);

    return { totalOrders, totalRevenue, pendingOrders };
  }
}