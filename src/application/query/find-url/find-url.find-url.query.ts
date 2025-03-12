import { Query } from '@nestjs/cqrs';

export class FindUrlQuery extends Query<string | null> {
  private readonly _shortUrl: string;

  constructor(shortUrl: string) {
    super();
    this._shortUrl = shortUrl;
  }

  get shortUrl(): string {
    return this._shortUrl;
  }
}
