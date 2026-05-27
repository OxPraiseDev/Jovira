import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinancialAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [totalOrders, totalRevenue, pendingPayments, totalCommissions] = await Promise.all([
      this.prisma.order.aggregate({
        where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        _count: true,
        totalAmount: { sum: true },
      }),
      this.prisma.order.aggregate({
        where: { status: 'PAID' },
        totalAmount: { sum: true },
      }),
      this.prisma.paymentTransaction.count({
        where: { status: 'INITIATED' },
      }),
      this.prisma.escrowLedger.aggregate({
        where: { entryType: 'COMMISSION' },
        amount: { sum: true },
      }),
    ]);

    return {
      totalOrders: totalOrders._count,
      totalRevenue: totalOrders.totalAmount?.sum || 0,
      pendingPayments,
      totalCommissions: totalCommissions.amount?.sum || 0,
    };
  }

  async getTransactions(startDate: Date, endDate: Date) {
    return this.prisma.paymentTransaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}