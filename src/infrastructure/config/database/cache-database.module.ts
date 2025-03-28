import { Module } from '@nestjs/common';

import { RedisDao } from '../../adapter/output/dao/redis.dao';

import { redisClientFactory } from './factory/redis-client.factory';

@Module({
  imports: [],
  controllers: [],
  providers: [redisClientFactory, RedisDao],
  exports: [RedisDao],
})
export class CacheDatabaseModule {}
