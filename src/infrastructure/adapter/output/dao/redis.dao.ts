import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { ICacheRepository } from '../../../../domain/port/output/cache-repository.interface';

@Injectable()
export class RedisDao implements OnModuleDestroy {
  constructor(@Inject(ICacheRepository) private readonly client: Redis) {}

  onModuleDestroy(): any {
    this.client.disconnect();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, override = false): Promise<void> {
    if (override) {
      await this.client.set(key, value);
      return;
    }
    await this.client.set(key, value, 'NX');
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }
}
