import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class WebhooksProducer {
  constructor(
    @InjectQueue('webhooks')
    private readonly webhooksQueue: Queue,
  ) {}

  async triggerWebhook(url: string, event: string, payload: any) {
    return this.webhooksQueue.add(
      'trigger',
      { url, event, payload },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 5000 },
        timeout: 10000,
      },
    );
  }

  async triggerOrderWebhook(orderId: string, event: string, payload: any) {
    return this.webhooksQueue.add(
      'order-webhook',
      { orderId, event, payload },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 5000 },
      },
    );
  }
}