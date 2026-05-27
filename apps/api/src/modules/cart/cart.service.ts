import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addItem(dto: AddCartItemDto) {
    return this.prisma.cartItem.upsert({
      where: {
        userId_skuVariationId_fulfillmentType: {
          userId: dto.userId,
          skuVariationId: dto.skuVariationId,
          fulfillmentType: dto.fulfillmentType,
        },
      },
      update: {
        quantity: { increment: dto.quantity },
      },
      create: dto,
    });
  }

  getItems(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeItem(id: string) {
    return this.prisma.cartItem.delete({ where: { id } });
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({ where: { userId } });
  }
}