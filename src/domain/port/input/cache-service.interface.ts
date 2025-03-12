import { UrlEntity } from '../../../infrastructure/entity/url.entity';

export interface ICacheService {
  save(urlEntity: UrlEntity): Promise<void>;
  findByKey(id: string): Promise<string | null>;
}

export const ICacheService = Symbol('ICacheService');
