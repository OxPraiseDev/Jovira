import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GeneralLedgerService } from './general-ledger.service';
import { CreateLedgerEntryDto } from './dto/create-ledger-entry.dto';

@Controller('general-ledger')
export class GeneralLedgerController {
  constructor(private readonly generalLedgerService: GeneralLedgerService) {}

  @Post('entry')
  createEntry(@Body() dto: CreateLedgerEntryDto) {
    return this.generalLedgerService.createEntry(dto);
  }

  @Post('double-entry')
  createDoubleEntry(@Body() body: { transactionId: string; debitAccount: string; creditAccount: string; amount: number; description?: string }) {
    return this.generalLedgerService.createDoubleEntry(body.transactionId, body.debitAccount, body.creditAccount, body.amount, body.description);
  }

  @Get('transaction/:transactionId')
  getByTransaction(@Param('transactionId') transactionId: string) {
    return this.generalLedgerService.getByTransaction(transactionId);
  }

  @Get('reconcile/:transactionId')
  reconcile(@Param('transactionId') transactionId: string) {
    return this.generalLedgerService.reconcile(transactionId);
  }
}