import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

import { redisClientFactory } from '../../../../../../src/infrastructure/config/database/factory/redis-client.factory';

const redisMethodsMock = {
  on: jest.fn(),
};

jest.mock('ioredis', () => {
  const mockedRedis = jest.fn().mockImplementation(() => {
    return redisMethodsMock;
  });
  return { Redis: mockedRedis };
});

describe('redisClientFactory', () => {
  let configService: ConfigService;

  beforeEach(() => {
    jest.clearAllMocks();

    configService = new ConfigService({
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
    });
  });

  it('should successfully create a Redis instance with valid configuration', async () => {
    const configServiceGetSpy = jest.spyOn(configService, 'get');
    const redisClient = await redisClientFactory.useFactory(configService);

    expect(configServiceGetSpy).toHaveBeenCalledWith('REDIS_HOST');
    expect(configServiceGetSpy).toHaveBeenCalledWith('REDIS_PORT');

    expect(Redis).toHaveBeenCalledTimes(1);
    expect(Redis).toHaveBeenCalledWith({
      host: 'localhost',
      port: 6379,
    });
    expect(redisClient).toBeDefined();
  });

  it('should throw an error when Redis connection fails', async () => {
    const errorMessage = 'Connection refused';

    redisMethodsMock.on.mockImplementationOnce(function (
      this: Redis,
      event: string,
      callback: (err: Error) => void,
    ) {
      if (event === 'error') {
        callback(new Error(errorMessage));
      }
      return this;
    });

    await expect(
      async () => await redisClientFactory.useFactory(configService),
    ).rejects.toThrow(`[Redis] - Connection failed: ${errorMessage}`);

    expect(redisMethodsMock.on).toHaveBeenCalledWith(
      'error',
      expect.any(Function),
    );
  });
});
