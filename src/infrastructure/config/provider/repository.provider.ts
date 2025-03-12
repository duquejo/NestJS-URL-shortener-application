import { Provider } from '@nestjs/common';

import { ICacheRepository } from '../../../domain/port/output/cache-repository.interface';
import { IUrlRepository } from '../../../domain/port/output/url-repository.interface';
import { CacheRepositoryAdapter } from '../../adapter/output/repository/cache-repository.adapter';
import { UrlRepositoryAdapter } from '../../adapter/output/repository/url-repository.adapter';

export const repositoryProvider: Provider[] = [
  {
    provide: IUrlRepository,
    useClass: UrlRepositoryAdapter,
  },
  {
    provide: ICacheRepository,
    useClass: CacheRepositoryAdapter,
  },
];
