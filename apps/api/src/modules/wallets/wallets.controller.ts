import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.walletsService.findOne(userId);
  }

  @Post(':userId')
  getOrCreate(@Param('userId') userId: string) {
    return this.walletsService.getOrCreate(userId);
  }

  @Post(':walletId/credit')
  credit(@Param('walletId') walletId: string, @Body() body: { amount: number; description: string; reference?: string }) {
    return this.walletsService.credit(walletId, body.amount, body.description, body.reference);
  }

  @Post(':walletId/debit')
  debit(@Param('walletId') walletId: string, @Body() body: { amount: number; description: string; reference?: string }) {
    return this.walletsService.debit(walletId, body.amount, body.description, body.reference);
  }
}