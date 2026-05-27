import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async setStock(dto: AdjustInventoryDto) {
    return this.prisma.productInventory.upsert({
      where: {
        warehouseId_skuVariationId: {
          warehouseId: dto.warehouseId,
          skuVariationId: dto.skuVariationId,
        },
      },
      update: {
        availableQty: dto.availableQty,
      },
      create: {
        warehouseId: dto.warehouseId,
        skuVariationId: dto.skuVariationId,
        availableQty: dto.availableQty,
      },
    });
  }

  async reserveStock(warehouseId: string, skuVariationId: string, qty = 1) {
    const inventory = await this.prisma.productInventory.findUnique({
      where: {
        warehouseId_skuVariationId: {
          warehouseId,
          skuVariationId,
        },
      },
    });

    if (!inventory || inventory.availableQty < qty) {
      throw new NotFoundException('Insufficient stock');
    }

    return this.prisma.productInventory.update({
      where: {
        warehouseId_skuVariationId: {
          warehouseId,
          skuVariationId,
        },
      },
      data: {
        availableQty: { decrement: qty },
        reservedQty: { increment: qty },
      },
    });
  }

  async releaseStock(warehouseId: string, skuVariationId: string, qty = 1) {
    return this.prisma.productInventory.update({
      where: {
        warehouseId_skuVariationId: {
          warehouseId,
          skuVariationId,
        },
      },
      data: {
        availableQty: { increment: qty },
        reservedQty: { decrement: qty },
      },
    });
  }

  findBySku(skuVariationId: string) {
    return this.prisma.productInventory.findMany({
      where: { skuVariationId },
      include: { warehouse: true, skuVariation: true },
    });
  }
}