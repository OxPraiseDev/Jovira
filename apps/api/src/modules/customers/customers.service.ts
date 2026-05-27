import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreate(userId: string, data?: any) {
    return this.prisma.customer.upsert({
      where: { userId },
      create: {
        userId,
        firstName: data?.firstName,
        lastName: data?.lastName,
        phone: data?.phone,
        address: data?.address,
        city: data?.city,
        state: data?.state,
        country: data?.country,
        zipCode: data?.zipCode,
      },
      update: data || {},
    });
  }

  findOne(userId: string) {
    return this.prisma.customer.findUnique({
      where: { userId },
    });
  }

  findAll() {
    return this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  updateLoyaltyPoints(userId: string, points: number) {
    return this.prisma.customer.update({
      where: { userId },
      data: { loyaltyPoints: { increment: points } },
    });
  }

  updateOrderStats(userId: string, amount: number) {
    return this.prisma.customer.update({
      where: { userId },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: amount },
      },
    });
  }
}