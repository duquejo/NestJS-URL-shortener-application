import { Module } from '@nestjs/common';
import { RedisDao } from '../../adapter/output/dao/redis.dao';
import { ICacheRepository } from '../../../domain/port/output/cache-repository.interface';
import { redisClientFactory } from './factory/redis-client.factory';
import { ConfigService } from '@nestjs/config';

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
