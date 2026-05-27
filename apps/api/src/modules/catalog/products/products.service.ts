import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        vendorId: dto.vendorId,
        categoryId: dto.categoryId,
        brandId: dto.brandId,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
      },
    });
  }

  findAll(query?: ProductQueryDto) {
    return this.prisma.product.findMany({
      where: {
        ...(query?.categoryId ? { categoryId: query.categoryId } : {}),
        ...(query?.brandId ? { brandId: query.brandId } : {}),
        ...(query?.vendorId ? { vendorId: query.vendorId } : {}),
        ...(query?.q
          ? {
              OR: [
                { name: { contains: query.q, mode: 'insensitive' } },
                { description: { contains: query.q, mode: 'insensitive' } },
                { slug: { contains: query.q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        category: true,
        brand: true,
        variations: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variations: true,
        images: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}