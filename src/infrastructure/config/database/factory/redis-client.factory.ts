import type { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

import { ICacheRepository } from '../../../../domain/port/output/cache-repository.interface';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: ICacheRepository,
  useFactory: (configService: ConfigService) => {
    const redisInstance = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
    });
    redisInstance.on('error', (err) => {
      throw new Error(`[Redis] - Connection failed: ${err.message}`);
    });
    return redisInstance;
  },
  inject: [ConfigService],
};
