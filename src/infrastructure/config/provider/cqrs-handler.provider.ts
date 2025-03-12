import { Provider } from '@nestjs/common';

import { ShortenUrlHandler } from '../../../application/command/shorten-url/shorten-url.handler';
import { FindUrlHandler } from '../../../application/query/find-url/find-url.handler';

export const cqrsHandlerProvider: Provider[] = [
  ShortenUrlHandler,
  FindUrlHandler,
];
