import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkuVariationDto } from './dto/create-sku-variation.dto';

@Injectable()
export class SkuVariationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSkuVariationDto) {
    return this.prisma.skuVariation.create({
      data: {
        productId: dto.productId,
        sku: dto.sku,
        barcode: dto.barcode,
        name: dto.name,
        color: dto.color,
        size: dto.size,
        price: dto.price,
        salePrice: dto.salePrice,
        weightKg: dto.weightKg,
        dimensionsJson: dto.dimensionsJson,
      },
    });
  }

  findAll(productId?: string) {
    return this.prisma.skuVariation.findMany({
      where: productId ? { productId } : undefined,
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const sku = await this.prisma.skuVariation.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!sku) throw new NotFoundException('SKU variation not found');
    return sku;
  }
}