import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // TODO: Restrict to your frontend domain
  },
})
@Injectable()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  private userSockets = new Map<string, string[]>(); // userId -> socketIds

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
    this.logger.log(`User ${userId} connected: ${client.id}`);

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, []);
    }

    this.userSockets.get(userId).push(client.id);
    client.join(`user:${userId}`);
  }

  @SubscribeMessage('leave')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
    this.logger.log(`User ${userId} disconnected: ${client.id}`);

    const sockets = this.userSockets.get(userId) || [];
    const index = sockets.indexOf(client.id);
    if (index > -1) {
      sockets.splice(index, 1);
    }

    if (sockets.length === 0) {
      this.userSockets.delete(userId);
    }
  }

  sendOrderUpdate(userId: string, orderId: string, status: string) {
    this.server.to(`user:${userId}`).emit('order-update', { orderId, status });
    this.logger.log(`Sent order update to user ${userId}: ${orderId} -> ${status}`);
  }

  sendPaymentUpdate(userId: string, paymentId: string, status: string) {
    this.server.to(`user:${userId}`).emit('payment-update', { paymentId, status });
  }

  sendVendorAlert(vendorId: string, message: string, type: string) {
    this.server.to(`user:${vendorId}`).emit('vendor-alert', { message, type });
  }

  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}