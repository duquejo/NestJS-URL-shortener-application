import { Inject, Injectable } from '@nestjs/common';
import { UrlEntity } from '../../infrastructure/entity/url.entity';
import { CreateRequestDto } from '../../domain/dto/create-request.dto';
import { IUrlRepository } from '../../domain/port/output/url-repository.interface';
import { IEncoderService } from '../../domain/port/input/encoder.interface';
import { AppLogger } from '../../infrastructure/config/log/console.logger';
import { ICacheRepository } from '../../domain/port/output/cache-repository.interface';

@Injectable()
export class UrlService {
  constructor(
    private readonly logger: AppLogger,
    @Inject(ICacheRepository)
    private readonly cacheRepository: ICacheRepository,
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

    this.logger.verbose(`Creating new URL [${newUrl.shortUrl}]`);

    const newUrlEntity = await this.urlRepository.save(newUrl);
    await this.cacheRepository.save(newUrlEntity);

    return newUrl.shortUrl!;
  }

  /**
   * Retrieve Long URL for a given ID
   *
   * @param {string} id Short URL identifier.
   * @return {Promise<string|null>} Long URL or null if the url isn't found.
   */
  public async findById(id: string): Promise<string | null> {
    const urlFromCache = await this.cacheRepository.findByKey(id);

    if (urlFromCache) {
      this.logger.verbose(`URL loaded from cache [${id}]`);
      return urlFromCache.longUrl;
    }

    const urlEntity = await this.urlRepository.findById(
      this.encoderService.decode(id),
    );

    if (!urlEntity) {
      this.logger.verbose('No url entity found.');
      return null;
    }

    this.logger.verbose(`URL entity found [${urlEntity.shortUrl}]`);

    await this.cacheUrlEntity(urlEntity);

    return urlEntity.longUrl;
  }

  /**
   * Caches a URL Entity for 60 seconds.
   *
   * @private
   * @param {UrlEntity} urlEntity URL Entity.
   * @return {Promise<void>}
   */
  private async cacheUrlEntity(urlEntity: UrlEntity): Promise<void> {
    this.logger.verbose(`Caching entity... [${urlEntity.shortUrl}]`);
    await this.cacheRepository.save(urlEntity);
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
