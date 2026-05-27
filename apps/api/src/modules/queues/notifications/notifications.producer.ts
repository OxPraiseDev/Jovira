import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsProducer {
  constructor(
    @InjectQueue('notifications')
    private readonly notificationsQueue: Queue,
  ) {}

  async sendOrderUpdate(userId: string, orderId: string, status: string) {
    return this.notificationsQueue.add(
      'order-update',
      { userId, orderId, status },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );
  }

  async sendPaymentConfirmation(userId: string, paymentId: string, status: string) {
    return this.notificationsQueue.add(
      'payment-update',
      { userId, paymentId, status },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );
  }

  async sendVendorAlert(vendorId: string, message: string, type: string) {
    return this.notificationsQueue.add(
      'vendor-alert',
      { vendorId, message, type },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );
  }
}