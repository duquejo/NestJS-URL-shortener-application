import { Test, TestingModule } from '@nestjs/testing';

import { ICacheRepository } from '../../../../../../src/domain/port/output/cache-repository.interface';
import { RedisDao } from '../../../../../../src/infrastructure/adapter/output/dao/redis.dao';

describe('RedisDao', () => {
  let service: RedisDao;

  let module: TestingModule;

  const key = 'something';
  const expectedResponse = 'Something interesting';

  const redisClientMock = {
    get: jest.fn(),
    set: jest.fn(),
    expire: jest.fn(),
    disconnect: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        RedisDao,
        {
          provide: ICacheRepository,
          useValue: redisClientMock,
        },
      ],
    }).compile();

    service = module.get(RedisDao);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a key', async () => {
    // Arrange
    redisClientMock.get.mockResolvedValueOnce(expectedResponse);

    // Act
    const result = await service.get(key);

    // Assert
    expect(result).toBe(expectedResponse);
    expect(redisClientMock.get).toHaveBeenCalledWith(key);
  });

  it('should set a key', () => {
    // Arrange
    const newValue = 'foo bar';
    redisClientMock.set.mockResolvedValueOnce('OK');

    // Act & Assert
    expect(() => service.set(key, newValue)).not.toThrow();
    expect(redisClientMock.set).toHaveBeenCalledWith(key, newValue, 'NX');
  });

  it('should set a key - Override option', () => {
    // Arrange
    const newValue = 'foo bar';
    redisClientMock.set.mockResolvedValueOnce('OK');

    // Act & Assert
    expect(() => service.set(key, newValue, true)).not.toThrow();
    expect(redisClientMock.set).toHaveBeenCalledWith(key, newValue);
  });

  it('should configure an expiration policy to a given key', () => {
    // Arrange
    const seconds = 5;
    redisClientMock.expire.mockResolvedValueOnce(123);

    // Act & Assert
    expect(() => service.expire(key, seconds)).not.toThrow();
    expect(redisClientMock.expire).toHaveBeenCalledWith(key, seconds);
  });

  it("should close the redis connection once 'onModuleDestroy' module hook has been triggered", async () => {
    // Arrange
    redisClientMock.disconnect.mockResolvedValue(undefined);

    // Act
    await module.close();

    // Assert
    expect(redisClientMock.disconnect).toHaveBeenCalled();
  });
});
