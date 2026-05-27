import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  addItem(@Body() dto: AddCartItemDto) {
    return this.cartService.addItem(dto);
  }

  @Get(':userId')
  getItems(@Param('userId') userId: string) {
    return this.cartService.getItems(userId);
  }

  @Delete('items/:id')
  removeItem(@Param('id') id: string) {
    return this.cartService.removeItem(id);
  }

  @Delete()
  clearCart(@Query('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}