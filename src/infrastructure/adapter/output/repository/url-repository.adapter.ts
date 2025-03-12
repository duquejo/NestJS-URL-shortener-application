import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { IUrlRepository } from '../../../../domain/port/output/url-repository.interface';
import { UrlEntity } from '../../../entity/url.entity';

@Injectable()
export class UrlRepositoryAdapter implements IUrlRepository {
  constructor(
    @InjectRepository(UrlEntity)
    private readonly repository: Repository<UrlEntity>,
  ) {}

  async findById(id: string): Promise<UrlEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async findByUrl(url: string): Promise<UrlEntity | null> {
    return this.repository.findOneBy({ longUrl: url });
  }

  async save(partialEntity: Partial<UrlEntity>): Promise<UrlEntity> {
    return this.repository.save(partialEntity);
  }
}
