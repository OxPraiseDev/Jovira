import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShippingZonesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.shippingZone.create({ data });
  }

  findByRoute(fromCityId: string, toCityId: string) {
    return this.prisma.shippingZone.findUnique({
      where: {
        fromCityId_toCityId: {
          fromCityId,
          toCityId,
        },
      },
    });
  }

  calculateFee(baseFee: number, perKgFee: number, weightKg: number) {
    return baseFee + perKgFee * weightKg;
  }
}