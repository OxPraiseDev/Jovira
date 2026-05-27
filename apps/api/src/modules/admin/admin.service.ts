import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingKyc,
      pendingReviews,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: { in: ['PAID', 'DELIVERED'] } },
        _sum: { totalAmount: true },
      }),
      this.prisma.vendorProfile.count({ where: { kycStatus: 'PENDING' } }),
      this.prisma.review.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingKyc,
      pendingReviews,
    };
  }
}