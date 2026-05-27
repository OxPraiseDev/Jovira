import { IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  vendorId: string;

  @IsString()
  type: string;

  @IsString()
  url: string;
}