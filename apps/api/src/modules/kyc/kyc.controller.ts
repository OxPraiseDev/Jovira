import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { KycService } from './kyc.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ApproveKycDto } from './dto/approve-kyc.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Controller('admin/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('submit')
  submit(@Body() dto: SubmitKycDto) {
    return this.kycService.submit(dto);
  }

  @Post('upload-document')
  uploadDocument(@Body() dto: UploadDocumentDto) {
    return this.kycService.uploadDocument(dto);
  }

  @Get('pending')
  getPendingKyc() {
    return this.kycService.getPendingKyc();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.kycService.getById(id);
  }

  @Post('approve')
  approve(@Body() dto: ApproveKycDto) {
    return this.kycService.approve(dto);
  }

  @Post('review-document')
  reviewDocument(@Body() body: { documentId: string; status: string; reviewedBy: string }) {
    return this.kycService.reviewDocument(body.documentId, body.status, body.reviewedBy);
  }
}