import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Sqids from 'sqids';

import { AppLogger } from '../../infrastructure/config/log/console.logger';
import { IEncoderService } from '../port/input/encoder-service.interface';

@Injectable()
export class Base62EncoderService implements IEncoderService {
  private readonly hashIdService: Sqids;
  private readonly minLength: number;
  private readonly alphabet: string;

  constructor(
    private configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(Base62EncoderService.name);

    this.minLength = this.configService.get<number>('URL_ENCODER_LENGTH')!;
    this.alphabet = this.configService.get<string>('URL_ENCODER_ALPHABET')!;

    this.hashIdService = new Sqids({
      minLength: this.minLength,
      alphabet: this.alphabet,
    });
  }

  public encode(id: string): string | null {
    const numericId = Number(id);

    if (isNaN(numericId)) {
      this.logger.error('The provided ID is not a valid number');
      return null;
    }

    try {
      return this.hashIdService.encode([numericId]);
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.logger.error(`Encoding failed: ${e.message}`);
      }
    }
    return null;
  }

  /**
   * Decodes a Base62 string into a numeric ID
   *
   * @param id - Base62 string.
   * @returns {string} decoded numeric ID.
   * @throws Error If the decoding process fails.
   */
  public decode(id: string): string | null {
    try {
      return String(this.hashIdService.decode(id)[0]);
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.logger.error(`Decoding failed: ${e.message}`);
      }
    }
    return null;
  }
}
