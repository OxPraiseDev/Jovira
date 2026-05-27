import { Controller, Get, Query } from '@nestjs/common';
import { FinancialAuditService } from './financial-audit.service';

@Controller('admin/financial')
export class FinancialAuditController {
  constructor(private readonly auditService: FinancialAuditService) {}

  @Get('dashboard')
  getDashboard() {
    return this.auditService.getDashboard();
  }

  @Get('transactions')
  getTransactions(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.auditService.getTransactions(new Date(startDate), new Date(endDate));
  }
}