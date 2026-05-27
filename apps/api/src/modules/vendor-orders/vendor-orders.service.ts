import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createForOrder(orderId: string, vendorId: string) {
    const now = new Date();
    return this.prisma.vendorOrder.create({
      data: {
        orderId,
        vendorId,
        status: 'AWAITING_ACCEPTANCE',
        acceptDeadline: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2h
        shipDeadline: new Date(now.getTime() + 26 * 60 * 60 * 1000), // 26h
      },
    });
  }

  async accept(id: string) {
    return this.prisma.vendorOrder.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        acceptTimestamp: new Date(),
        shipDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  async ship(id: string) {
    return this.prisma.vendorOrder.update({
      where: { id },
      data: { status: 'SHIPPED', shipTimestamp: new Date() },
    });
  }

  async findByOrder(orderId: string) {
    return this.prisma.vendorOrder.findMany({
      where: { orderId },
    });
  }
}