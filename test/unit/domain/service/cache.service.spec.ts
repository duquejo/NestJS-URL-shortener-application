import { Test, TestingModule } from '@nestjs/testing';

import { ICacheService } from '../../../../src/domain/port/input/cache-service.interface';
import { ICacheRepository } from '../../../../src/domain/port/output/cache-repository.interface';
import { CacheService } from '../../../../src/domain/service/cache.service';
import { AppLogger } from '../../../../src/infrastructure/config/log/console.logger';
import { UrlEntity } from '../../../../src/infrastructure/entity/url.entity';

describe('CacheService', () => {
  let service: ICacheService;

  const dateMock = new Date();

  const expectedEntity: UrlEntity = {
    id: '1234567890',
    shortUrl: 'mockurl',
    longUrl:
      'https://xyz.abc?foo=bar&bar=baz&page=1&per_page=10&ga=asbcuhfue123',
    createdAt: dateMock,
    updatedAt: dateMock,
  };

  const mockRepository = {
    findByKey: jest.fn(),
    save: jest.fn(),
  };

  const mockLogger = {
    setContext: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: ICacheRepository,
          useValue: mockRepository,
        },
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ICacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find an element from cache - not found', async () => {
    // Arrange
    mockRepository.findByKey.mockResolvedValueOnce(null);

    // Act
    const result = await service.findByKey(expectedEntity.shortUrl);

    // Assert
    expect(result).toBeNull();
    expect(mockRepository.findByKey).toHaveBeenCalledWith(
      expectedEntity.shortUrl,
    );
    expect(mockLogger.verbose).not.toHaveBeenCalled();
  });

  it('should find an element from cache - found', async () => {
    // Arrange
    mockRepository.findByKey.mockResolvedValueOnce(expectedEntity);

    // Act
    const result = await service.findByKey(expectedEntity.shortUrl);

    // Assert
    expect(result).toBe(expectedEntity.longUrl);
    expect(mockRepository.findByKey).toHaveBeenCalledWith(
      expectedEntity.shortUrl,
    );
    expect(mockLogger.verbose).toHaveBeenCalled();
  });

  it('should save and cache a given entity', async () => {
    // Arrange & Act
    await service.save(expectedEntity);

    // Assert
    expect(mockRepository.save).toHaveBeenCalledWith(expectedEntity);
    expect(mockLogger.verbose).toHaveBeenCalled();
  });
});
