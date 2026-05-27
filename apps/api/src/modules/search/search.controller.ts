import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('products')
  searchProducts(
    @Query('q') q: string,
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
  ) {
    return this.searchService.searchProducts(q, { categoryId, brandId });
  }

  @Post('index/product/:productId')
  indexProduct(@Body('productId') productId: string) {
    return this.searchService.indexProduct(productId);
  }
}