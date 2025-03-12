import { Provider } from '@nestjs/common';

import { ICacheService } from '../../../domain/port/input/cache-service.interface';
import { IEncoderService } from '../../../domain/port/input/encoder-service.interface';
import { IUrlService } from '../../../domain/port/input/url-service.interface';
import { Base62EncoderService } from '../../../domain/service/base62-encoder.service';
import { CacheService } from '../../../domain/service/cache.service';
import { UrlService } from '../../../domain/service/url.service';

export const servicesProvider: Provider[] = [
  {
    provide: IUrlService,
    useClass: UrlService,
  },
  {
    provide: ICacheService,
    useClass: CacheService,
  },
  {
    provide: IEncoderService,
    useClass: Base62EncoderService,
  },
];
