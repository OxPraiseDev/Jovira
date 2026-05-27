import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ApproveKycDto } from './dto/approve-kyc.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { EmailProducer } from '../../modules/queues/email/email.producer';

@Injectable()
export class KycService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailProducer: EmailProducer,
  ) {}

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
    const vendor = await this.prisma.vendorProfile.update({
      where: { id: dto.vendorId },
      data: {
        kycStatus: dto.status,
        approvedAt: dto.status === 'VERIFIED' ? new Date() : null,
        rejectionReason: dto.rejectionReason,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: vendor.userId },
    });

    // Send email asynchronously
    await this.emailProducer.sendKycStatus(vendor.id, user.email, dto.status);

    return vendor;
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

