import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShippingCalculatorService {
  constructor(private readonly prisma: PrismaService) {}

  async calculate(fromCityId: string, toCityId: string, weightKg: number, dimensions?: { length: number; width: number; height: number }) {
    const zone = await this.prisma.shippingZone.findUnique({
      where: {
        fromCityId_toCityId: {
          fromCityId,
          toCityId,
        },
      },
    });

    if (!zone) throw new Error('No shipping zone found for this route');

    const volumeWeight = dimensions
      ? (dimensions.length * dimensions.width * dimensions.height) / 5000
      : 0;

    const chargeableWeight = Math.max(weightKg, volumeWeight);

    const baseFee = Number(zone.baseFee);
    const perKgFee = Number(zone.perKgFee);

    const total = baseFee + perKgFee * chargeableWeight;

    return {
      baseFee,
      perKgFee,
      weightKg,
      volumeWeight,
      chargeableWeight,
      total,
    };
  }
}