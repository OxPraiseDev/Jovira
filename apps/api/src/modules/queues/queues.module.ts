import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailProducer } from './email/email.producer';
import { EmailProcessor } from './email/email.processor';
import { NotificationsProducer } from './notifications/notifications.producer';
import { NotificationsProcessor } from './notifications/notifications.processor';
import { WebhooksProducer } from './webhooks/webhooks.producer';
import { WebhooksProcessor } from './webhooks/webhooks.processor';
import { NotificationsGateway } from './webhooks/notifications.gateway';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
    BullModule.registerQueue({
      name: 'webhooks',
    }),
  ],
  providers: [
    EmailProducer,
    EmailProcessor,
    NotificationsProducer,
    NotificationsProcessor,
    WebhooksProducer,
    WebhooksProcessor,
    NotificationsGateway,
  ],
  exports: [EmailProducer, NotificationsProducer, WebhooksProducer],
})
export class QueuesModule {}