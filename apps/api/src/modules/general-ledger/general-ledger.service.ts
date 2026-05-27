import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLedgerEntryDto } from './dto/create-ledger-entry.dto';

@Injectable()
export class GeneralLedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async createEntry(dto: CreateLedgerEntryDto) {
    return this.prisma.generalLedger.create({
      data: {
        transactionId: dto.transactionId,
        entryType: dto.entryType,
        account: dto.account,
        amount: dto.amount,
        description: dto.description,
      },
    });
  }

  async createDoubleEntry(transactionId: string, debitAccount: string, creditAccount: string, amount: number, description?: string) {
    const [debit, credit] = await this.prisma.$transaction([
      this.prisma.generalLedger.create({
        data: {
          transactionId,
          entryType: 'DEBIT',
          account: debitAccount,
          amount,
          description,
        },
      }),
      this.prisma.generalLedger.create({
        data: {
          transactionId,
          entryType: 'CREDIT',
          account: creditAccount,
          amount,
          description,
        },
      }),
    ]);

    return { debit, credit };
  }

  async getByTransaction(transactionId: string) {
    return this.prisma.generalLedger.findMany({
      where: { transactionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async reconcile(transactionId: string) {
    const entries = await this.getByTransaction(transactionId);

    const debitTotal = entries
      .filter(e => e.entryType === 'DEBIT')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const creditTotal = entries
      .filter(e => e.entryType === 'CREDIT')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      transactionId,
      debitTotal,
      creditTotal,
      balanced: Math.abs(debitTotal - creditTotal) < 0.01,
    };
  }
}