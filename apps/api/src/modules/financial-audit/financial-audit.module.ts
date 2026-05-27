import { Module } from '@nestjs/common';
import { FinancialAuditController } from './financial-audit.controller';
import { FinancialAuditService } from './financial-audit.service';

@Module({
  controllers: [FinancialAuditController],
  providers: [FinancialAuditService],
  exports: [FinancialAuditService],
})
export class FinancialAuditModule {}