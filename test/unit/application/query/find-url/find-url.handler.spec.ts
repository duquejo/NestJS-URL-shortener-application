import { Test, TestingModule } from '@nestjs/testing';

import { FindUrlQuery } from '../../../../../src/application/query/find-url/find-url.find-url.query';
import { FindUrlHandler } from '../../../../../src/application/query/find-url/find-url.handler';
import { IUrlService } from '../../../../../src/domain/port/input/url-service.interface';

describe('FindUrlHandler', () => {
  let handler: FindUrlHandler;

  const shortUrl = 'mockurl';
  const longUrl =
    'https://xyz.abc?foo=bar&bar=baz&page=1&per_page=10&ga=asbcuhfue123';

  const urlServiceMock = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        FindUrlHandler,
        {
          provide: IUrlService,
          useValue: urlServiceMock,
        },
      ],
    }).compile();
    handler = module.get(FindUrlHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call the findById service after command execution', async () => {
    // Arrange
    const command = new FindUrlQuery(shortUrl);
    urlServiceMock.findById.mockResolvedValue(longUrl);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result).toEqual(longUrl);
    expect(urlServiceMock.findById).toHaveBeenCalledWith(shortUrl);
  });
});
