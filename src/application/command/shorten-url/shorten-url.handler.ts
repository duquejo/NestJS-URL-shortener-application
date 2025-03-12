import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IUrlService } from '../../../domain/port/input/url-service.interface';

import { ShortenUrlCommand } from './shorten-url.command';

@CommandHandler(ShortenUrlCommand)
export class ShortenUrlHandler implements ICommandHandler<ShortenUrlCommand> {
  constructor(@Inject(IUrlService) private readonly urlService: IUrlService) {}

  async execute(command: ShortenUrlCommand): Promise<string> {
    return this.urlService.save(command.shortUrl);
  }
}
