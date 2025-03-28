import { Test, TestingModule } from '@nestjs/testing';

import { ICacheService } from '../../../../src/domain/port/input/cache-service.interface';
import { IEncoderService } from '../../../../src/domain/port/input/encoder-service.interface';
import { IUrlService } from '../../../../src/domain/port/input/url-service.interface';
import { IUrlRepository } from '../../../../src/domain/port/output/url-repository.interface';
import { UrlService } from '../../../../src/domain/service/url.service';
import { AppLogger } from '../../../../src/infrastructure/config/log/console.logger';
import { UrlEntity } from '../../../../src/infrastructure/entity/url.entity';

describe('UrlService', () => {
  let service: IUrlService;

  const dateMock = new Date();

  const expectedEntity: UrlEntity = {
    id: '1234567890',
    shortUrl: 'mockurl',
    longUrl:
      'https://xyz.abc?foo=bar&bar=baz&page=1&per_page=10&ga=asbcuhfue123',
    createdAt: dateMock,
    updatedAt: dateMock,
  };

  const mockLogger = {
    setContext: jest.fn(),
    verbose: jest.fn(),
  };

  const mockCacheService = {
    save: jest.fn(),
    findByKey: jest.fn(),
  };

  const mockEncoderService = {
    encode: jest.fn(),
    decode: jest.fn(),
  };

  const mockUrlRepository = {
    findByUrl: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        UrlService,
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
        {
          provide: ICacheService,
          useValue: mockCacheService,
        },
        {
          provide: IEncoderService,
          useValue: mockEncoderService,
        },
        {
          provide: IUrlRepository,
          useValue: mockUrlRepository,
        },
      ],
    }).compile();
    service = module.get<IUrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve a long url from the cache', async () => {
    mockCacheService.findByKey.mockResolvedValueOnce(expectedEntity.longUrl);

    const result = await service.findById(expectedEntity.shortUrl);

    expect(result).toBe(expectedEntity.longUrl);
    expect(mockCacheService.findByKey).toHaveBeenCalledWith(
      expectedEntity.shortUrl,
    );

    expect(mockUrlRepository.findById).not.toHaveBeenCalled();
    expect(mockEncoderService.encode).not.toHaveBeenCalled();
    expect(mockLogger.verbose).not.toHaveBeenCalled();
    expect(mockCacheService.save).not.toHaveBeenCalled();
  });

  it('should retrieve a long url from the repository', async () => {
    mockCacheService.findByKey.mockResolvedValueOnce(null);
    mockEncoderService.decode.mockReturnValueOnce(expectedEntity.id);
    mockUrlRepository.findById.mockResolvedValueOnce(expectedEntity);

    const result = await service.findById(expectedEntity.shortUrl);

    expect(result).toBe(expectedEntity.longUrl);
    expect(mockCacheService.findByKey).toHaveBeenCalledWith(
      expectedEntity.shortUrl,
    );
    expect(mockEncoderService.decode).toHaveBeenCalledWith(
      expectedEntity.shortUrl,
    );
    expect(mockUrlRepository.findById).toHaveBeenCalledWith(expectedEntity.id);
    expect(mockLogger.verbose).toHaveBeenCalledWith(
      `URL entity found [${expectedEntity.shortUrl}]`,
    );
    expect(mockCacheService.save).toHaveBeenCalledWith(expectedEntity);
  });

  it('should return null if the short url cannot be decoded', async () => {
    mockCacheService.findByKey.mockResolvedValueOnce(null);
    mockEncoderService.decode.mockReturnValueOnce(null);

    const result = await service.findById(expectedEntity.shortUrl);

    expect(result).toBeNull();
    expect(mockCacheService.findByKey).toHaveBeenCalledWith(
      expectedEntity.shortUrl,
    );
    expect(mockEncoderService.decode).toHaveBeenCalledWith(
      expectedEntity.shortUrl,
    );
    expect(mockLogger.verbose).toHaveBeenCalledWith(
      'The short url could not be decoded.',
    );

    expect(mockUrlRepository.findById).not.toHaveBeenCalled();
    expect(mockCacheService.save).not.toHaveBeenCalled();
  });

  it('should return null if the url is not cached and unavailable from database', async () => {
    mockCacheService.findByKey.mockResolvedValueOnce(null);
    mockEncoderService.decode.mockReturnValueOnce(expectedEntity.id);
    mockUrlRepository.findById.mockResolvedValueOnce(null);

    const result = await service.findById(expectedEntity.shortUrl);

    expect(result).toBeNull();
    expect(mockCacheService.findByKey).toHaveBeenCalledWith(
      expectedEntity.shortUrl,
    );
    expect(mockEncoderService.decode).toHaveBeenCalledWith(
      expectedEntity.shortUrl,
    );
    expect(mockUrlRepository.findById).toHaveBeenCalledWith(expectedEntity.id);

    expect(mockLogger.verbose).toHaveBeenCalledWith('No url entity found.');
    expect(mockCacheService.save).not.toHaveBeenCalled();
  });

  it('should return null if the given id could not be encoded', async () => {
    mockUrlRepository.findByUrl.mockResolvedValueOnce(null);
    mockEncoderService.encode.mockReturnValueOnce(null);

    const result = await service.save(expectedEntity.longUrl);

    expect(result).toBeNull();
    expect(mockUrlRepository.findByUrl).toHaveBeenCalledWith(
      expectedEntity.longUrl,
    );
    expect(mockEncoderService.encode).toHaveBeenCalledWith(expect.any(String));

    expect(mockLogger.verbose).toHaveBeenCalledWith(
      `The id could not be encoded.`,
    );

    expect(mockCacheService.save).not.toHaveBeenCalled();
    expect(mockUrlRepository.save).not.toHaveBeenCalled();
  });

  it('should save an existing url', async () => {
    mockUrlRepository.findByUrl.mockResolvedValueOnce(expectedEntity);

    const result = await service.save(expectedEntity.longUrl);

    expect(result).toBe(expectedEntity.shortUrl);
    expect(mockUrlRepository.findByUrl).toHaveBeenCalledWith(
      expectedEntity.longUrl,
    );
    expect(mockLogger.verbose).toHaveBeenCalledWith(
      `Existing URL [${expectedEntity.shortUrl}]`,
    );

    expect(mockEncoderService.encode).not.toHaveBeenCalled();
    expect(mockCacheService.save).not.toHaveBeenCalled();
    expect(mockUrlRepository.save).not.toHaveBeenCalled();
  });

  it('should save a new url', async () => {
    const expectedPartialUrlArgs = {
      id: expect.any(String) as string,
      longUrl: expectedEntity.longUrl,
      shortUrl: expectedEntity.shortUrl,
    };

    const expectedArgs = {
      createdAt: expect.any(Date) as Date,
      updatedAt: expect.any(Date) as Date,
      ...expectedPartialUrlArgs,
    };

    mockUrlRepository.findByUrl.mockResolvedValueOnce(null);
    mockEncoderService.encode.mockReturnValueOnce(expectedEntity.shortUrl);
    mockUrlRepository.save.mockResolvedValueOnce(expectedEntity);

    const result = await service.save(expectedEntity.longUrl);

    expect(result).toBe(expectedEntity.shortUrl);
    expect(mockEncoderService.encode).toHaveBeenCalledWith(expect.any(String));
    expect(mockUrlRepository.findByUrl).toHaveBeenCalledWith(
      expectedEntity.longUrl,
    );
    expect(mockUrlRepository.save).toHaveBeenCalledWith(expectedPartialUrlArgs);

    expect(mockLogger.verbose).toHaveBeenCalledWith(
      `Creating new URL [${expectedEntity.shortUrl}]`,
    );

    expect(mockCacheService.save).toHaveBeenCalledWith(expectedArgs);
  });
});
