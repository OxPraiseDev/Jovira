import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EscrowService {
  constructor(private readonly prisma: PrismaService) {}

  async releaseForOrder(orderId: string) {
    const held = await this.prisma.escrowLedger.findFirst({
      where: {
        orderId,
        entryType: 'HOLD',
        status: 'PENDING',
      },
    });

    if (!held) return null;

    // In real flow, compute commission and vendor amount
    const commissionAmount = Number(held.amount) * 0.1;
    const vendorAmount = Number(held.amount) - commissionAmount;

    await this.prisma.escrowLedger.update({
      where: { id: held.id },
      data: { status: 'RELEASED' },
    });

    await this.prisma.escrowLedger.create({
      data: {
        orderId,
        amount: commissionAmount,
        entryType: 'COMMISSION',
        status: 'SETTLED',
      },
    });

    await this.prisma.escrowLedger.create({
      data: {
        orderId,
        amount: vendorAmount,
        entryType: 'VENDOR_CREDIT',
        status: 'CREDITED',
      },
    });

    return { commissionAmount, vendorAmount };
  }
}