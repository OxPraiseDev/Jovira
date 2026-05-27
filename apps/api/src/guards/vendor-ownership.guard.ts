import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class VendorOwnershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const vendorId = request.params.vendorId || request.body.vendorId;

    if (!userId || !vendorId) return true;

    const vendorProfile = await this.prisma.vendorProfile.findUnique({
      where: { id: vendorId },
    });

    if (!vendorProfile || vendorProfile.userId !== userId) {
      throw new ForbiddenException('You do not own this vendor account');
    }

    return true;
  }
}