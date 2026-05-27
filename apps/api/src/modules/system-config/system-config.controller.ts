import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';

@Controller('admin/system-config')
export class SystemConfigController {
  constructor(private readonly configService: SystemConfigService) {}

  @Get()
  getAll() {
    return this.configService.getAll();
  }

  @Get(':key')
  get(@Param('key') key: string) {
    return this.configService.get(key);
  }

  @Post()
  set(@Body() body: { key: string; value: any; description?: string }) {
    return this.configService.set(body.key, body.value, body.description);
  }
}