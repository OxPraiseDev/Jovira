import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from '../../websocket/notifications.gateway';

@Processor('notifications')
@Injectable()
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private readonly notificationsGateway: NotificationsGateway) {
    super();
  }

  async process(job: Job) {
    this.logger.log(`Processing notification job: ${job.name} - ${job.id}`);

    try {
      switch (job.name) {
        case 'order-update':
          this.notificationsGateway.sendOrderUpdate(job.data.userId, job.data.orderId, job.data.status);
          break;
        case 'payment-update':
          this.notificationsGateway.sendPaymentUpdate(job.data.userId, job.data.paymentId, job.data.status);
          break;
        case 'vendor-alert':
          this.notificationsGateway.sendVendorAlert(job.data.vendorId, job.data.message, job.data.type);
          break;
        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(`Notification job failed: ${job.id} - ${error.message}`);
      throw error;
    }
  }
}