import { UrlEntity } from '../../../infrastructure/entity/url.entity';

export const IUrlRepository = Symbol('IUrlRepository');

export interface IUrlRepository {
  findByUrl(url: string): Promise<UrlEntity | null>;
  findById(id: string): Promise<UrlEntity | null>;
  save(partialEntity: Partial<UrlEntity>): Promise<UrlEntity>;
}
