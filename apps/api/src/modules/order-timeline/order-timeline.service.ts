import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderTimelineService {
  constructor(private readonly prisma: PrismaService) {}

  add(orderId: string, status: string, location?: string, note?: string) {
    return this.prisma.orderTimeline.create({
      data: {
        orderId,
        status,
        location,
        note,
      },
    });
  }

  findByOrder(orderId: string) {
    return this.prisma.orderTimeline.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
  }
}