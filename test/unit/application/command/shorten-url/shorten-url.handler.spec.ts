import { Test, TestingModule } from '@nestjs/testing';

import { ShortenUrlCommand } from '../../../../../src/application/command/shorten-url/shorten-url.command';
import { ShortenUrlHandler } from '../../../../../src/application/command/shorten-url/shorten-url.handler';
import { IUrlService } from '../../../../../src/domain/port/input/url-service.interface';

describe('ShortenUrlHandler', () => {
  let handler: ShortenUrlHandler;

  const shortUrl = 'mockurl';
  const longUrl =
    'https://xyz.abc?foo=bar&bar=baz&page=1&per_page=10&ga=asbcuhfue123';

  const urlServiceMock = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        ShortenUrlHandler,
        {
          provide: IUrlService,
          useValue: urlServiceMock,
        },
      ],
    }).compile();
    handler = module.get(ShortenUrlHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call the save service after command execution', async () => {
    // Arrange
    const command = new ShortenUrlCommand(longUrl);
    urlServiceMock.save.mockResolvedValue(shortUrl);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result).toEqual(shortUrl);
    expect(urlServiceMock.save).toHaveBeenCalledWith(longUrl);
  });
});
