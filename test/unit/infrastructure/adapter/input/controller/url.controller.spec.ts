import { HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { ShortenUrlCommand } from '../../../../../../src/application/command/shorten-url/shorten-url.command';
import { FindUrlQuery } from '../../../../../../src/application/query/find-url/find-url.find-url.query';
import { CreateRequestDto } from '../../../../../../src/domain/dto/create-request.dto';
import { UrlController } from '../../../../../../src/infrastructure/adapter/input/controller/url.controller';
import { ApplicationThrottleGuard } from '../../../../../../src/infrastructure/config/throttler/guard/app-throttle.guard';

describe('UrlController', () => {
  const longUrl = 'https://xyz.abc?foo=bar&bar=baz';
  const shortenedUrl = 'AbCabxz';

  let controller: UrlController;
  const commandBusMock = {
    execute: jest.fn(),
  };
  const queryBusMock = {
    execute: jest.fn(),
  };
  const resMock: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    redirect: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: CommandBus,
          useValue: commandBusMock,
        },
        {
          provide: QueryBus,
          useValue: queryBusMock,
        },
      ],
    })
      .overrideGuard(ApplicationThrottleGuard) // Bypass guard.
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(UrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should shorten an longUrl successfully', async () => {
    // Arrange
    commandBusMock.execute.mockResolvedValueOnce(shortenedUrl);
    const request: CreateRequestDto = { longUrl: longUrl };

    // Act
    await controller.create(resMock as Response, request);

    // Assert
    expect(commandBusMock.execute).toHaveBeenCalledWith(
      new ShortenUrlCommand(request.longUrl),
    );
    expect(resMock.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(resMock.send).toHaveBeenCalledWith(shortenedUrl);
  });

  it('should return an internal server error if shortening fails', async () => {
    // Arrange
    commandBusMock.execute.mockResolvedValueOnce(null);
    const request: CreateRequestDto = { longUrl: 'longUrl' };

    // Act
    await controller.create(resMock as Response, request);

    // Assert
    expect(commandBusMock.execute).toHaveBeenCalledWith(
      new ShortenUrlCommand(request.longUrl),
    );
    expect(resMock.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(resMock.send).toHaveBeenCalledWith('Something went wrong.');
  });

  it('should redirect if the long url is found', async () => {
    // Arrange
    queryBusMock.execute.mockResolvedValueOnce(longUrl);
    const request = shortenedUrl;

    // Act
    await controller.findUrl(resMock as Response, request);

    // Assert
    expect(queryBusMock.execute).toHaveBeenCalledWith(
      new FindUrlQuery(request),
    );
    expect(resMock.redirect).toHaveBeenCalledWith(longUrl);
  });

  it('should return not found if the long url is not available', async () => {
    // Arrange
    queryBusMock.execute.mockResolvedValueOnce(null);
    const request = shortenedUrl;

    // Act
    await controller.findUrl(resMock as Response, request);

    // Assert
    expect(queryBusMock.execute).toHaveBeenCalledWith(
      new FindUrlQuery(request),
    );
    expect(resMock.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(resMock.send).toHaveBeenCalledWith('Not found');
    expect(resMock.redirect).not.toHaveBeenCalled();
  });
});
