import { UrlEntity } from '../../../infrastructure/entity/url.entity';

export interface ICacheRepository {
  save(payload: UrlEntity): Promise<void>;
  findByKey(id: string): Promise<UrlEntity | null>;
}

export const ICacheRepository = Symbol.for('ICacheRepository');
