import { Command } from '@nestjs/cqrs';

export class ShortenUrlCommand extends Command<string | null> {
  private readonly _longUrl: string;

  constructor(longUrl: string) {
    super();
    this._longUrl = longUrl;
  }

  get longUrl(): string {
    return this._longUrl;
  }
}
