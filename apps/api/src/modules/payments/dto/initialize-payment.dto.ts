import { IsEnum, IsString } from 'class-validator';

export class InitializePaymentDto {
  @IsString()
  orderId: string;

  @IsEnum(['PAYSTACK', 'FLUTTERWAVE', 'CASH', 'WALLET'] as any)
  gateway: 'PAYSTACK' | 'FLUTTERWAVE' | 'CASH' | 'WALLET';
}