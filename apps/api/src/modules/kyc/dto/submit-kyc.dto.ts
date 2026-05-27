import { IsString } from 'class-validator';

export class SubmitKycDto {
  @IsString()
  userId: string;

  @IsString()
  companyName: string;

  @IsString()
  businessType: string;

  @IsString()
  kycDocuments: string; // JSON string with document URLs
}