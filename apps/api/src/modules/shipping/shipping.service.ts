import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShippingService {
  constructor(private readonly prisma: PrismaService) {}

  createRate(data: any) {
    return this.prisma.shippingRate.create({
      data: {
        zoneId: data.zoneId,
        carrier: data.carrier,
        service: data.service,
        baseFee: data.baseFee,
        perKgFee: data.perKgFee,
        minDays: data.minDays,
        maxDays: data.maxDays,
      },
    });
  }

  findByZone(zoneId: string) {
    return this.prisma.shippingRate.findMany({
      where: { zoneId, isActive: true },
    });
  }

  calculate(baseFee: number, perKgFee: number, weightKg: number) {
    return baseFee + perKgFee * weightKg;
  }
}