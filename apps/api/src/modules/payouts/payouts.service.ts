import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async requestPayout(vendorId: string, amount: number, method: string, bankDetails: any) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: vendorId },
    });

    if (!wallet) throw new NotFoundException('Wallet not found');
    if (Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    const fee = amount * 0.01; // 1% fee
    const netAmount = amount - fee;

    return this.prisma.$transaction([
      this.prisma.wallet.debit(wallet.id, amount, 'Payout request'),
      this.prisma.payout.create({
        data: {
          vendorId,
          walletId: wallet.id,
          amount,
          fee,
          netAmount,
          method,
          bankDetails,
          status: 'PENDING',
        },
      }),
    ]);
  }

  findAll(vendorId?: string) {
    return this.prisma.payout.findMany({
      where: vendorId ? { vendorId } : undefined,
      orderBy: { requestedAt: 'desc' },
    });
  }

  async approve(id: string) {
    return this.prisma.payout.update({
      where: { id },
      data: {
        status: 'PROCESSING',
        processedAt: new Date(),
      },
    });
  }

  async complete(id: string) {
    return this.prisma.payout.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }
}