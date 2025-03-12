import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { IUrlService } from '../../../domain/port/input/url-service.interface';

import { FindUrlQuery } from './find-url.find-url.query';

@QueryHandler(FindUrlQuery)
export class FindUrlHandler implements IQueryHandler<FindUrlQuery> {
  constructor(@Inject(IUrlService) private readonly urlService: IUrlService) {}

  async execute(query: FindUrlQuery): Promise<string | null> {
    return this.urlService.findById(query.shortUrl);
  }
}
