import { Body, Controller, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  initialize(@Body() dto: InitializePaymentDto) {
    return this.paymentsService.initialize(dto);
  }

  @Post('webhook/:reference')
  webhook(@Param('reference') reference: string, @Body() body: any) {
    const status = body.status ?? 'SUCCESS';
    return this.paymentsService.handleWebhook(reference, status, body);
  }
}