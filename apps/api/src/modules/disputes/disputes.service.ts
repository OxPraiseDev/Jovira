import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { orderId: string; type: string; reason: string; description: string }) {
    return this.prisma.dispute.create({ data });
  }

  findByOrder(orderId: string) {
    return this.prisma.dispute.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.dispute.update({
      where: { id },
      data: { status },
    });
  }
}