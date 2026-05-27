import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailProducer {
  constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue,
  ) {}

  async sendWelcomeEmail(userId: string, email: string) {
    return this.emailQueue.add(
      'welcome',
      { userId, email, template: 'welcome' },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      },
    );
  }

  async sendOrderConfirmation(orderId: string, email: string, order: any) {
    return this.emailQueue.add(
      'order-confirmation',
      { orderId, email, order, template: 'order-confirmation' },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );
  }

  async sendKycStatus(vendorId: string, email: string, status: string) {
    return this.emailQueue.add(
      'kyc-status',
      { vendorId, email, status, template: 'kyc-status' },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );
  }

  async sendLowStockAlert(sku: string, quantity: number, email: string) {
    return this.emailQueue.add(
      'low-stock',
      { sku, quantity, email, template: 'low-stock' },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );
  }

  async sendEmail(dto: SendEmailDto) {
    return this.emailQueue.add(
      'custom',
      dto,
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );
  }
}