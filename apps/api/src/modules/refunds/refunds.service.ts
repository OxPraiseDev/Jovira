import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefundsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { orderId: string; orderItemId?: string; amount: number; reason: string }) {
    return this.prisma.refund.create({
      data: {
        ...data,
        amount: data.amount,
      },
    });
  }

  findByOrder(orderId: string) {
    return this.prisma.refund.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approve(id: string) {
    return this.prisma.refund.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async reject(id: string) {
    return this.prisma.refund.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async process(id: string) {
    return this.prisma.refund.update({
      where: { id },
      data: { status: 'PROCESSING' },
    });
  }

  async complete(id: string) {
    return this.prisma.refund.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }
}