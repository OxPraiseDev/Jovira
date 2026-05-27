import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  async preview(userId: string) {
    const items = await this.prisma.cartItem.findMany({ where: { userId } });

    const subtotal = items.reduce((sum, item: any) => sum + Number(item.quantity) * 1000, 0);

    return {
      items,
      subtotal,
      shippingFee: 0,
      total: subtotal,
    };
  }

  async placeOrder(dto: CheckoutDto) {
    const items = await this.prisma.cartItem.findMany({ where: { userId: dto.userId } });

    if (!items.length) {
      throw new BadRequestException('Cart is empty');
    }

    const subtotal = items.reduce((sum, item: any) => sum + Number(item.quantity) * 1000, 0);
    const shippingFee = 0;
    const totalAmount = subtotal + shippingFee;

    const order = await this.prisma.order.create({
      data: {
        customerId: dto.userId,
        totalAmount,
        shippingFee,
        deliveryAddressId: dto.deliveryAddressId,
        status: 'PENDING_PAYMENT',
        paymentStatus: 'INITIATED',
        items: {
          create: items.map((item) => ({
            skuVariationId: item.skuVariationId,
            quantity: item.quantity,
            unitPrice: 1000,
            fulfillmentType: item.fulfillmentType,
          })),
        },
      },
      include: { items: true },
    });

    await this.prisma.cartItem.deleteMany({ where: { userId: dto.userId } });

    return order;
  }
}