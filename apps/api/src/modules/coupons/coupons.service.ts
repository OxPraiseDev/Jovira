import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.coupon.create({
      data: {
        ...data,
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
      },
    });
  }

  findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async validate(code: string, userId: string, orderAmount: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) throw new BadRequestException('Invalid coupon');
    if (coupon.status !== 'ACTIVE') throw new BadRequestException('Coupon is not active');
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new BadRequestException('Coupon is not valid at this time');
    }

    if (coupon.minOrder && orderAmount < Number(coupon.minOrder)) {
      throw new BadRequestException(`Minimum order amount is ${coupon.minOrder}`);
    }

    // Check if user already used this coupon
    const alreadyUsed = await this.prisma.couponUsage.findFirst({
      where: { couponId: coupon.id, userId },
    });

    if (alreadyUsed) {
      throw new BadRequestException('You have already used this coupon');
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = orderAmount * (Number(coupon.value) / 100);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, Number(coupon.maxDiscount));
      }
    } else {
      discount = Number(coupon.value);
    }

    return { coupon, discount };
  }

  async use(couponId: string, userId: string, orderId: string) {
    await this.prisma.couponUsage.create({
      data: { couponId, userId, orderId },
    });

    return this.prisma.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } },
    });
  }
}