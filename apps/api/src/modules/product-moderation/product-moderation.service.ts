import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async getQueue() {
    return this.prisma.productModerationQueue.findMany({
      where: { status: 'PENDING' },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async review(productId: string, status: 'APPROVED' | 'REJECTED' | 'BLOCKED', reviewedBy: string, reason?: string) {
    const queue = await this.prisma.productModerationQueue.findUnique({
      where: { productId },
    });

    if (!queue) throw new NotFoundException('Product not in moderation queue');

    await this.prisma.product.update({
      where: { id: productId },
      data: { status, isActive: status === 'APPROVED' },
    });

    return this.prisma.productModerationQueue.update({
      where: { productId },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy,
        reason,
      },
    });
  }

  async flag(productId: string, flaggedBy: string, reason: string) {
    return this.prisma.productModerationQueue.upsert({
      where: { productId },
      create: {
        productId,
        status: 'PENDING',
        flaggedBy,
        reason,
      },
      update: {
        status: 'PENDING',
        flaggedBy,
        reason,
      },
    });
  }
}