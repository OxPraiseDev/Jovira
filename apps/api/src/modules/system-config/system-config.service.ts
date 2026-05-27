import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async get(key: string) {
    const config = await this.prisma.systemConfig.findUnique({
      where: { key },
    });

    return config?.value;
  }

  async set(key: string, value: any, description?: string) {
    return this.prisma.systemConfig.upsert({
      where: { key },
      create: {
        key,
        value,
        description,
      },
      update: {
        value,
        description,
      },
    });
  }

  getAll() {
    return this.prisma.systemConfig.findMany({
      orderBy: { key: 'asc' },
    });
  }
}