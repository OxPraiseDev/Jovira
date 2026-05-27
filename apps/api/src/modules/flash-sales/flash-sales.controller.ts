import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';

@Controller('flash-sales')
export class FlashSalesController {
  constructor(private readonly flashSalesService: FlashSalesService) {}

  @Post()
  create(@Body() body: any) {
    return this.flashSalesService.create(body);
  }

  @Get()
  findAll() {
    return this.flashSalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashSalesService.findOne(id);
  }
}