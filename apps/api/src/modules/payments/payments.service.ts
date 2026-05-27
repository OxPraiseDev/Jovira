import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly paystackSecretKey: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
  }

  async initialize(dto: InitializePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) throw new BadRequestException('Order not found');
    if (order.paymentStatus !== 'INITIATED') {
      throw new BadRequestException('Order payment already initiated');
    }

    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        orderId: dto.orderId,
        gateway: 'paystack',
        reference: `PAY_${dto.orderId}_${Date.now()}`,
        amount: order.totalAmount,
        status: 'INITIATED',
      },
    });

    // Call Paystack API to initialize transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'customer@example.com',
        amount: Number(order.totalAmount) * 100, // in kobo
        reference: transaction.reference,
        callback_url: `${this.configService.get('APP_URL')}/payment/callback`,
      }),
    });

    const paystackData = await paystackResponse.json();

    return {
      transactionId: transaction.id,
      reference: transaction.reference,
      authUrl: paystackData.data.authorization_url,
    };
  }

  async verifyPayment(reference: string) {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${this.paystackSecretKey}`,
      },
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      await this.prisma.paymentTransaction.update({
        where: { reference },
        data: { status: 'SUCCESS' },
      });

      await this.prisma.order.update({
        where: { id: data.data.order },
        data: { status: 'PAID', paymentStatus: 'SUCCESS' },
      });

      await this.createEscrowHold(data.data.order, data.data.amount / 100, reference);
    }

    return data;
  }

  async handleWebhook(body: any, secret: string) {
    // Verify webhook signature
    const crypto = require('crypto');
    const signature = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');

    // Process event
    if (body.event === 'charge.success') {
      await this.verifyPayment(body.data.reference);
    }
  }

  private async createEscrowHold(orderId: string, amount: number, transactionRef: string) {
    await this.prisma.escrowLedger.create({
      data: {
        transactionId: transactionRef,
        orderId,
        buyerId: orderId,
        amount,
        entryType: 'HOLD',
        status: 'PENDING',
      },
    });
  }
}