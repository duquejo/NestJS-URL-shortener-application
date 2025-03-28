import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import type { IUrlRepository } from '../../../../../../src/domain/port/output/url-repository.interface';
import { UrlRepositoryAdapter } from '../../../../../../src/infrastructure/adapter/output/repository/url-repository.adapter';
import { UrlEntity } from '../../../../../../src/infrastructure/entity/url.entity';
import { MockRepository } from '../../../../utils/typings';

describe('UrlRepositoryAdapter', () => {
  let module: TestingModule;
  let adapter: IUrlRepository;
  let repository: MockRepository<UrlEntity>;

  const mockUrlEntityMock = () => ({
    findOneBy: jest.fn(),
    save: jest.fn(),
  });

  const mockDate = new Date();

  const expectedUrlEntity: UrlEntity = {
    id: Date.now().toString(),
    shortUrl: 'AabCaXyz',
    longUrl: 'https://abc.xyz?foo=bar&bar=baz',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const repositoryProvider = getRepositoryToken(UrlEntity);

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UrlRepositoryAdapter,
        {
          provide: repositoryProvider,
          useFactory: mockUrlEntityMock,
        },
      ],
    }).compile();

    adapter = module.get<IUrlRepository>(UrlRepositoryAdapter);
    repository = module.get(repositoryProvider);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should return a UrlEntity if found by id', async () => {
    (repository.findOneBy as jest.Mock).mockResolvedValueOnce(
      expectedUrlEntity,
    );

    const result = await adapter.findById(expectedUrlEntity.id);

    expect(result).toEqual(expectedUrlEntity);
    expect(repository.findOneBy).toHaveBeenCalledWith({
      id: expectedUrlEntity.id,
    });
  });

  it('should return null if UrlEntity is not found by id', async () => {
    (repository.findOneBy as jest.Mock).mockResolvedValueOnce(null);

    const result = await adapter.findById(expectedUrlEntity.id);

    expect(result).toBeNull();
    expect(repository.findOneBy).toHaveBeenCalledWith({
      id: expectedUrlEntity.id,
    });
  });

  it('should return a UrlEntity if found by url', async () => {
    (repository.findOneBy as jest.Mock).mockResolvedValueOnce(
      expectedUrlEntity,
    );

    const result = await adapter.findByUrl(expectedUrlEntity.longUrl);

    expect(result).toEqual(expectedUrlEntity);
    expect(repository.findOneBy).toHaveBeenCalledWith({
      longUrl: expectedUrlEntity.longUrl,
    });
  });

  it('should return null if UrlEntity is not found by url', async () => {
    (repository.findOneBy as jest.Mock).mockResolvedValueOnce(null);

    const result = await adapter.findByUrl(expectedUrlEntity.longUrl);

    expect(result).toBeNull();
    expect(repository.findOneBy).toHaveBeenCalledWith({
      longUrl: expectedUrlEntity.longUrl,
    });
  });

  it('should save and return a saved UrlEntity', async () => {
    (repository.save as jest.Mock).mockResolvedValue(expectedUrlEntity);

    const result = await adapter.save(expectedUrlEntity);

    expect(result).toEqual(expectedUrlEntity);
    expect(repository.save).toHaveBeenCalledWith(expectedUrlEntity);
  });
});
