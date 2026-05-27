import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { orderId: string; productId: string; skuVariationId: string; quantity: number; unitPrice: number }) {
    const subtotal = data.quantity * data.unitPrice;
    return this.prisma.orderItem.create({
      data: {
        ...data,
        subtotal,
        discount: 0,
      },
    });
  }

  findByOrder(orderId: string) {
    return this.prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true, skuVariation: true },
    });
  }
}