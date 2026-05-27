import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminActivityLogService {
  constructor(private readonly prisma: PrismaService) {}

  log(adminId: string, action: string, entity: string, entityId?: string, metadata?: any) {
    return this.prisma.adminActivityLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId,
        metadata,
      },
    });
  }

  getAdminLogs(adminId: string) {
    return this.prisma.adminActivityLog.findMany({
      where: { adminId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}