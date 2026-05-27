import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchProducts(query: string, filters?: { categoryId?: string; brandId?: string; minPrice?: number; maxPrice?: number }) {
    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { slug: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.brandId) where.brandId = filters.brandId;

    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        variations: true,
        images: true,
      },
      take: 50,
    });
  }

  async indexProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, brand: true },
    });

    if (!product) return null;

    return this.prisma.productSearchIndex.upsert({
      where: { productId },
      create: {
        productId,
        name: product.name,
        description: product.description,
        slug: product.slug,
        categoryId: product.categoryId,
        brandId: product.brandId,
        vendorId: product.vendorId,
        price: product.variations?.[0]?.price || 0,
      },
      update: {
        name: product.name,
        description: product.description,
      },
    });
  }
}