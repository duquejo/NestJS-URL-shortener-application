import { Command } from '@nestjs/cqrs';

export class ShortenUrlCommand extends Command<string> {
  private readonly _shortUrl: string;

  constructor(shortUrl: string) {
    super();
    this._shortUrl = shortUrl;
  }

  get shortUrl(): string {
    return this._shortUrl;
  }
}
