import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlashSalesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; description?: string; startDate: string; endDate: string; items: any[] }) {
    return this.prisma.$transaction(async (tx) => {
      const flashSale = await tx.flashSale.create({
        data: {
          name: data.name,
          description: data.description,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          status: 'SCHEDULED',
        },
      });

      for (const item of data.items) {
        await tx.flashSaleItem.create({
          data: {
            flashSaleId: flashSale.id,
            productId: item.productId,
            discount: item.discount,
            originalPrice: item.originalPrice,
            salePrice: item.salePrice,
            stock: item.stock,
          },
        });
      }

      return tx.flashSale.findUnique({
        where: { id: flashSale.id },
        include: { items: true },
      });
    });
  }

  findAll() {
    return this.prisma.flashSale.findMany({
      where: { status: { in: ['SCHEDULED', 'ACTIVE'] } },
      include: { items: true },
      orderBy: { startDate: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.flashSale.findUnique({
      where: { id },
      include: { items: true },
    });
  }
}