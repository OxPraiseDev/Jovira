import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ApproveKycDto } from './dto/approve-kyc.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Injectable()
export class KycService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(dto: SubmitKycDto) {
    const existing = await this.prisma.vendorProfile.findUnique({
      where: { userId: dto.userId },
    });

    if (existing) {
      throw new BadRequestException('KYC already submitted');
    }

    return this.prisma.vendorProfile.create({
      data: {
        userId: dto.userId,
        companyName: dto.companyName,
        businessType: dto.businessType,
        kycDocuments: JSON.parse(dto.kycDocuments),
        kycStatus: 'PENDING',
      },
    });
  }

  async uploadDocument(dto: UploadDocumentDto) {
    return this.prisma.kycDocument.create({
      data: {
        vendorId: dto.vendorId,
        type: dto.type,
        url: dto.url,
        status: 'PENDING',
      },
    });
  }

  async getPendingKyc() {
    return this.prisma.vendorProfile.findMany({
      where: { kycStatus: 'PENDING' },
      include: {
        kycDocuments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { id },
      include: {
        kycDocuments: true,
      },
    });

    if (!vendor) throw new NotFoundException('Vendor profile not found');
    return vendor;
  }

  async approve(dto: ApproveKycDto) {
    const now = new Date();

    return this.prisma.vendorProfile.update({
      where: { id: dto.vendorId },
      data: {
        kycStatus: dto.status,
        approvedAt: dto.status === 'VERIFIED' ? now : null,
        rejectionReason: dto.rejectionReason,
      },
    });
  }

  async reviewDocument(documentId: string, status: string, reviewedBy: string) {
    return this.prisma.kycDocument.update({
      where: { id: documentId },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy,
      },
    });
  }
}