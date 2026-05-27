import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddProductImageDto } from './dto/add-product-image.dto';

@Injectable()
export class ProductImagesService {
  constructor(private readonly prisma: PrismaService) {}

  addImage(dto: AddProductImageDto) {
    return this.prisma.productImage.create({
      data: {
        productId: dto.productId,
        url: dto.url,
        altText: dto.altText,
        position: dto.position ?? 0,
      },
    });
  }

  listByProduct(productId: string) {
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { position: 'asc' },
    });
  }

  async removeImage(id: string) {
    const image = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!image) throw new NotFoundException('Product image not found');

    return this.prisma.productImage.delete({
      where: { id },
    });
  }
}