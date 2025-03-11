import Sqids from 'sqids';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEncoderService } from '../../domain/port/input/encoder.interface';

@Injectable()
export class Base62EncoderService implements IEncoderService {
  private hashIdService: Sqids;

  constructor(private configService: ConfigService) {
    const minLength = this.configService.get<number>('URL_ENCODER_LENGTH')!;
    const alphabet = this.configService.get<string>('URL_ENCODER_ALPHABET')!;
    this.hashIdService = new Sqids({ minLength, alphabet });
  }

  public encode(id: string): string {
    return this.hashIdService.encode([+id]);
  }

  public decode(id: string): string {
    return String(this.hashIdService.decode(id)[0]);
  }
}
