import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreate(userId: string) {
    return this.prisma.wallet.upsert({
      where: { userId },
      create: { userId, balance: 0 },
      update: {},
    });
  }

  findOne(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
  }

  async credit(walletId: string, amount: number, description: string, reference?: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const balanceAfter = Number(wallet.balance) + amount;

    return this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: walletId },
        data: { balance: balanceAfter },
      }),
      this.prisma.walletTransaction.create({
        data: {
          walletId,
          type: 'DEPOSIT',
          amount,
          balanceAfter,
          description,
          reference,
        },
      }),
    ]);
  }

  async debit(walletId: string, amount: number, description: string, reference?: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (Number(wallet.balance) < amount) {
      throw new NotFoundException('Insufficient balance');
    }

    const balanceAfter = Number(wallet.balance) - amount;

    return this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: walletId },
        data: { balance: balanceAfter },
      }),
      this.prisma.walletTransaction.create({
        data: {
          walletId,
          type: 'WITHDRAWAL',
          amount: -amount,
          balanceAfter,
          description,
          reference,
        },
      }),
    ]);
  }
}