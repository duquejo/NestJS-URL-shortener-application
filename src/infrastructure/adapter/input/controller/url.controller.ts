import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';

import { ShortenUrlCommand } from '../../../../application/command/shorten-url/shorten-url.command';
import { FindUrlQuery } from '../../../../application/query/find-url/find-url.find-url.query';
import { CreateRequestDto } from '../../../../domain/dto/create-request.dto';
import { ShortUrlValidationPipe } from '../../../../domain/pipe/short-url-validation.pipe';

@Controller('v1')
export class UrlController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('/data/shorten')
  async create(@Body() createRequestDto: CreateRequestDto): Promise<string> {
    return this.commandBus.execute(
      new ShortenUrlCommand(createRequestDto.longUrl),
    );
  }

  @Get(':id')
  async findUrl(
    @Res() res: Response,
    @Param('id', ShortUrlValidationPipe) id: string,
  ): Promise<void> {
    const url = await this.queryBus.execute(new FindUrlQuery(id));

    if (!url) {
      res.status(HttpStatus.NOT_FOUND).send('Not found');
      return;
    }

    res.redirect(url);
  }
}
