import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string) {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      throw new BadRequestException('Validation failed: not a number');
    }
    return parsed;
  }
}