import { Inject, Injectable } from '@nestjs/common';
import { UrlEntity } from '../../infrastructure/entity/url.entity';
import { CreateRequestDto } from '../../domain/dto/create-request.dto';
import { IUrlRepository } from '../../domain/port/outbound/url-repository.interface';
import { IEncoderService } from '../../domain/port/inbound/encoder.interface';
import { AppLogger } from '../../infrastructure/config/log/console.logger';

@Injectable()
export class UrlService {
  constructor(
    private readonly logger: AppLogger,
    @Inject(IEncoderService) private readonly encoderService: IEncoderService,
    @Inject(IUrlRepository) private readonly urlRepository: IUrlRepository,
  ) {
    this.logger.setContext(UrlService.name);
  }

  /**
   * Create a URL Instance from a given Long URL or returns an existing one.
   *
   * @param {CreateRequestDto} createRequestDto New URL Data Transfer Object.
   * @return {string} Long URL.
   */
  public async save(createRequestDto: CreateRequestDto): Promise<string> {
    const urlEntity = await this.urlRepository.findByUrl(
      createRequestDto.longUrl,
    );

    if (urlEntity) {
      this.logger.verbose(`Existing URL [${urlEntity.shortUrl}]`);
      return urlEntity.shortUrl;
    }

    const newUrl = this.buildURLEntity(createRequestDto);

    this.logger.verbose(`Creating new URL [${newUrl.shortUrl}`);
    await this.urlRepository.save(newUrl);
    return newUrl.shortUrl!;
  }

  /**
   * Retrieve Long URL for a given ID
   *
   * @param {string} id Short URL identifier.
   * @return {Promise<string|null>} Long URL or null if the url isn't found.
   */
  public async findById(id: string): Promise<string | null> {
    const urlEntity = await this.urlRepository.findById(
      this.encoderService.decode(id),
    );

    if (!urlEntity) {
      this.logger.verbose('No url entity found.');
      return null;
    }

    this.logger.verbose(`URL entity found [${urlEntity.shortUrl}]`);
    return urlEntity.longUrl;
  }

  /**
   * Build a new Database-friendly URL Entity from a long URL DTO.
   *
   * @private
   * @param {CreateRequestDto} createRequestDto New URL Data Transfer Object.
   * @return {Partial<UrlEntity>} Partial URL Class instance.
   */
  private buildURLEntity(
    createRequestDto: CreateRequestDto,
  ): Partial<UrlEntity> {
    const unixTimeId = Date.now().toString();
    return {
      id: unixTimeId,
      longUrl: createRequestDto.longUrl,
      shortUrl: this.encoderService.encode(unixTimeId),
    };
  }
}
