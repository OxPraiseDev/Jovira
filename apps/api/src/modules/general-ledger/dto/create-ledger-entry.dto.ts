import { IsDecimal, IsEnum, IsString, Min } from 'class-validator';

export class CreateLedgerEntryDto {
  @IsString()
  transactionId: string;

  @IsEnum(['DEBIT', 'CREDIT'] as any)
  entryType: 'DEBIT' | 'CREDIT';

  @IsString()
  account: string;

  @IsDecimal({ decimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsString()
  description?: string;
}