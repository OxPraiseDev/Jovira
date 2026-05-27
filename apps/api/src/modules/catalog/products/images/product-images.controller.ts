import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { AddProductImageDto } from './dto/add-product-image.dto';

@Controller('catalog/products/images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post()
  addImage(@Body() dto: AddProductImageDto) {
    return this.productImagesService.addImage(dto);
  }

  @Get(':productId')
  listByProduct(@Param('productId') productId: string) {
    return this.productImagesService.listByProduct(productId);
  }

  @Delete(':id')
  removeImage(@Param('id') id: string) {
    return this.productImagesService.removeImage(id);
  }
}