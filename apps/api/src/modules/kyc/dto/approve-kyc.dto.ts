import { IsEnum, IsString } from 'class-validator';

export class ApproveKycDto {
  @IsString()
  vendorId: string;

  @IsString()
  reviewedBy: string;

  @IsEnum(['VERIFIED', 'REJECTED', 'SUSPENDED'] as any)
  status: 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

  @IsString()
  rejectionReason?: string;
}