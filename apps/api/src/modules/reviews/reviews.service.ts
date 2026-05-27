import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { productId: string; orderId: string; userId: string; rating: number; comment?: string }) {
    // Check if user already reviewed this product
    const existing = await this.prisma.review.findFirst({
      where: {
        productId: data.productId,
        userId: data.userId,
      },
    });

    if (existing) {
      throw new BadRequestException('You have already reviewed this product');
    }

    return this.prisma.review.create({
      data,
    });
  }

  findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductRating(productId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { productId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: true,
    });

    return {
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count,
    };
  }

  findOne(id: string) {
    return this.prisma.review.findUnique({ where: { id } });
  }

  async approve(id: string) {
    return this.prisma.review.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async reject(id: string) {
    return this.prisma.review.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }
}