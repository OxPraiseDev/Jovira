import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { SkuVariationsModule } from './sku-variations/sku-variations.module';

@Module({
  imports: [CategoriesModule, BrandsModule, ProductsModule, SkuVariationsModule],
  exports: [CategoriesModule, BrandsModule, ProductsModule, SkuVariationsModule],
})
export class CatalogModule {}