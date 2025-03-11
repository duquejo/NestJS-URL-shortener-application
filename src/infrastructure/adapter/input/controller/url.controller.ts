import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CreateRequestDto } from '../../../../domain/dto/create-request.dto';
import { UrlService } from '../../../../application/services/url.service';
import { ShortUrlValidationPipe } from '../../../../domain/pipe/short-url-validation.pipe';

@Controller('v1')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('/data/shorten')
  async create(@Body() createRequestDto: CreateRequestDto): Promise<string> {
    return this.urlService.save(createRequestDto);
  }

  @Get(':id')
  async shortUrl(
    @Res() res: Response,
    @Param('id', ShortUrlValidationPipe) id: string,
  ): Promise<void> {
    const url = await this.urlService.findById(id);

    if (!url) {
      res.status(HttpStatus.NOT_FOUND).send('Not found');
      return;
    }

    res.redirect(url);
  }
}
