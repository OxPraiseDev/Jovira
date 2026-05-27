import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommissionConfigService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.commissionConfig.create({
      data: {
        categoryIds: data.categoryIds,
        countryId: data.countryId,
        type: data.type,
        value: data.value,
        priority: data.priority ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.commissionConfig.findMany({
      where: { isActive: true },
      orderBy: { priority: 'desc' },
    });
  }

  async calculateCommission(orderId: string, vendorId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return null;

    const configs = await this.prisma.commissionConfig.findMany({
      where: { isActive: true },
      orderBy: { priority: 'desc' },
    });

    const total = Number(order.totalAmount);
    const commissionRate = configs[0]?.value || 0; // Use highest priority
    const commission = total * (Number(commissionRate) / 100);

    return {
      orderId,
      vendorId,
      total,
      commission,
      vendorAmount: total - commission,
      rate: commissionRate / 100,
    };
  }
}