import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Processor('webhooks')
@Injectable()
export class WebhooksProcessor extends WorkerHost {
  private readonly logger = new Logger(WebhooksProcessor.name);

  constructor(private readonly httpService: HttpService) {
    super();
  }

  async process(job: Job) {
    this.logger.log(`Processing webhook job: ${job.name} - ${job.id}`);

    try {
      switch (job.name) {
        case 'trigger':
          await this.triggerWebhook(job.data.url, job.data.event, job.data.payload);
          break;
        case 'order-webhook':
          await this.triggerOrderWebhook(job.data.orderId, job.data.event, job.data.payload);
          break;
        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(`Webhook job failed: ${job.id} - ${error.message}`);
      throw error;
    }
  }

  private async triggerWebhook(url: string, event: string, payload: any) {
    try {
      await firstValueFrom(
        this.httpService.post(url, { event, data: payload }, {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': this.generateSignature(url, payload),
          },
          timeout: 10000,
        }),
      );
      this.logger.log(`Webhook triggered successfully: ${event}`);
    } catch (error) {
      this.logger.error(`Webhook failed: ${url} - ${error.message}`);
      throw error;
    }
  }

  private async triggerOrderWebhook(orderId: string, event: string, payload: any) {
    // Trigger webhook for order events
    await this.triggerWebhook(payload.webhookUrl, event, payload);
  }

  private generateSignature(url: string, payload: any): string {
    // TODO: Implement HMAC signature for webhook security
    const crypto = require('crypto');
    const secret = 'your-webhook-secret';
    return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
  }
}