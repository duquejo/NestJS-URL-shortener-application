import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const redisClientFactory = (configService: ConfigService) => {
  const redisInstance = new Redis({
    host: configService.get<string>('REDIS_HOST'),
    port: configService.get<number>('REDIS_PORT'),
  });
  redisInstance.on('error', (err) => {
    throw new Error(`[Redis] - Connection failed: ${err.message}`);
  });
  return redisInstance;
};
