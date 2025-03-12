import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ICacheRepository } from '../../../domain/port/output/cache-repository.interface';
import { RedisDao } from '../../adapter/output/dao/redis.dao';

import { redisClientFactory } from './factory/redis-client.factory';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: ICacheRepository,
      useFactory: redisClientFactory,
      inject: [ConfigService],
    },
    RedisDao,
  ],
  exports: [RedisDao],
})
export class CacheDatabaseModule {}
