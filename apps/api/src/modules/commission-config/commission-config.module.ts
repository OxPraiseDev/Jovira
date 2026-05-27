import { Module } from '@nestjs/common';
import { CommissionConfigController } from './commission-config.controller';
import { CommissionConfigService } from './commission-config.service';

@Module({
  controllers: [CommissionConfigController],
  providers: [CommissionConfigService],
  exports: [CommissionConfigService],
})
export class CommissionConfigModule {}