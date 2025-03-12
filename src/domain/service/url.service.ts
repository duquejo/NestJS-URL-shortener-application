import { Inject, Injectable } from '@nestjs/common';

import { AppLogger } from '../../infrastructure/config/log/console.logger';
import { UrlEntity } from '../../infrastructure/entity/url.entity';
import { ICacheService } from '../port/input/cache-service.interface';
import { IEncoderService } from '../port/input/encoder-service.interface';
import { IUrlService } from '../port/input/url-service.interface';
import { IUrlRepository } from '../port/output/url-repository.interface';

@Injectable()
export class UrlService implements IUrlService {
  constructor(
    private readonly logger: AppLogger,
    @Inject(ICacheService) private readonly cacheService: ICacheService,
    @Inject(IEncoderService) private readonly encoderService: IEncoderService,
    @Inject(IUrlRepository) private readonly urlRepository: IUrlRepository,
  ) {
    this.logger.setContext(UrlService.name);
  }

  /**
   * Retrieve Long URL for a given ID
   *
   * @param {string} id Short URL identifier.
   * @return {Promise<string|null>} Long URL or null if the url isn't found.
   */
  public async findById(id: string): Promise<string | null> {
    const urlFromCache = await this.cacheService.findByKey(id);

    if (urlFromCache) {
      return urlFromCache;
    }

    const urlEntity = await this.urlRepository.findById(
      this.encoderService.decode(id),
    );

    if (!urlEntity) {
      this.logger.verbose('No url entity found.');
      return null;
    }

    this.logger.verbose(`URL entity found [${urlEntity.shortUrl}]`);
    await this.cacheService.save(urlEntity);

    return urlEntity.longUrl;
  }

  /**
   * Create a URL Instance from a given Long URL or returns an existing one.
   *
   * @param {string} longUrl New Short URL Data Transfer Object.
   * @return {string} Long URL.
   */
  public async save(longUrl: string): Promise<string> {
    const urlEntity = await this.urlRepository.findByUrl(longUrl);

    if (urlEntity) {
      this.logger.verbose(`Existing URL [${urlEntity.shortUrl}]`);
      return urlEntity.shortUrl;
    }

    const newUrl = this.buildURLEntity(longUrl);
    this.logger.verbose(`Creating new URL [${newUrl.shortUrl}]`);

    const newUrlEntity = await this.urlRepository.save(newUrl);

    await this.cacheService.save(newUrlEntity);

    return newUrl.shortUrl!;
  }

  /**
   * Build a new Database-friendly URL Entity from a long URL DTO.
   *
   * @private
   * @param {string} longUrl New URL Data Transfer Object.
   * @return {Partial<UrlEntity>} Partial URL Class instance.
   */
  private buildURLEntity(longUrl: string): Partial<UrlEntity> {
    const unixTimeId = Date.now().toString();
    return {
      id: unixTimeId,
      longUrl,
      shortUrl: this.encoderService.encode(unixTimeId),
    };
  }
}
