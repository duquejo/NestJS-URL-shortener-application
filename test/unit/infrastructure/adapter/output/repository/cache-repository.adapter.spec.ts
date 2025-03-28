import { Test, TestingModule } from '@nestjs/testing';

import type { ICacheRepository } from '../../../../../../src/domain/port/output/cache-repository.interface';
import { RedisDao } from '../../../../../../src/infrastructure/adapter/output/dao/redis.dao';
import { CacheRepositoryAdapter } from '../../../../../../src/infrastructure/adapter/output/repository/cache-repository.adapter';
import { UrlEntity } from '../../../../../../src/infrastructure/entity/url.entity';

describe('CacheRepositoryAdapter', () => {
  let module: TestingModule;
  let adapter: ICacheRepository;

  const expectedEntity: UrlEntity = {
    id: expect.any(String) as string,
    longUrl: 'https://xyz.abc?foo=bar&hello=world',
    shortUrl: 'PaWsaZzz',
    updatedAt: expect.any(Date) as Date,
    createdAt: expect.any(Date) as Date,
  };

  const redisDaoMock = {
    get: jest.fn(),
    set: jest.fn(),
    expire: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    module = await Test.createTestingModule({
      providers: [
        CacheRepositoryAdapter,
        {
          provide: RedisDao,
          useValue: redisDaoMock,
        },
      ],
    }).compile();

    adapter = module.get<ICacheRepository>(CacheRepositoryAdapter);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should save an url entity', async () => {
    redisDaoMock.set.mockResolvedValueOnce(undefined);
    redisDaoMock.expire.mockResolvedValueOnce(undefined);

    await adapter.save(expectedEntity);

    expect(redisDaoMock.set).toHaveBeenCalledWith(
      expect.stringContaining(expectedEntity.shortUrl),
      JSON.stringify(expectedEntity),
    );
    expect(redisDaoMock.expire).toHaveBeenCalledWith(
      expect.stringContaining(expectedEntity.shortUrl),
      60,
    );
  });

  it('should find a key from a given short url and return an entity', async () => {
    redisDaoMock.get.mockResolvedValueOnce(JSON.stringify(expectedEntity));

    const entity = await adapter.findByKey(expectedEntity.shortUrl);

    expect(entity).toHaveProperty('id');
    expect(entity).toHaveProperty('longUrl', expectedEntity.longUrl);
    expect(entity).toHaveProperty('shortUrl', expectedEntity.shortUrl);
    expect(entity).toHaveProperty('createdAt');
    expect(entity).toHaveProperty('updatedAt');

    expect(redisDaoMock.get).toHaveBeenCalledWith(
      expect.stringContaining(expectedEntity.shortUrl),
    );
  });

  it('should return a null if the short url is not available', async () => {
    redisDaoMock.get.mockResolvedValueOnce(null);

    const entity = await adapter.findByKey(expectedEntity.shortUrl);

    expect(entity).toBeNull();
    expect(redisDaoMock.get).toHaveBeenCalledWith(
      expect.stringContaining(expectedEntity.shortUrl),
    );
  });
});
