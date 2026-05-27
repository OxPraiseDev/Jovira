import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateReservationDto) {
    const expiresAt = new Date(Date.now() + dto.ttlMinutes * 60 * 1000);

    return this.prisma.inventoryReservation.create({
      data: {
        warehouseId: dto.warehouseId,
        skuVariationId: dto.skuVariationId,
        quantity: dto.quantity,
        expiresAt,
      },
    });
  }

  releaseExpired() {
    return this.prisma.inventoryReservation.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}