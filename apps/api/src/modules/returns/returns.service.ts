import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReturnsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { orderId: string; orderItemId: string; reason: string; description?: string }) {
    return this.prisma.return.create({
      data,
    });
  }

  findByOrder(orderId: string) {
    return this.prisma.return.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string, trackingNumber?: string) {
    return this.prisma.return.update({
      where: { id },
      data: { status, trackingNumber },
    });
  }
}