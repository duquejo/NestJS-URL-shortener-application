import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { urlSchema } from '../schema/config.schema';

@Injectable()
export class ShortUrlValidationPipe implements PipeTransform<string> {
  async transform(value: string) {
    if (!value) {
      throw new BadRequestException('URL must be a string');
    }
    try {
      return await urlSchema.validateAsync(value);
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
    }
  }
}
