import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import Sqids from 'sqids';

import { IEncoderService } from '../../../../src/domain/port/input/encoder-service.interface';
import { Base62EncoderService } from '../../../../src/domain/service/base62-encoder.service';
import { AppLogger } from '../../../../src/infrastructure/config/log/console.logger';

describe('Base62EncoderService', () => {
  const encoderLengthMock = 5;
  const encoderAlphabetMock = 'foBAR12345';

  let service: IEncoderService;
  const configServiceMock = {
    get: jest.fn((key: string) => {
      if (key === 'URL_ENCODER_LENGTH') return encoderLengthMock;
      if (key === 'URL_ENCODER_ALPHABET') return encoderAlphabetMock;
    }),
  };

  const mockLogger = {
    setContext: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Base62EncoderService,
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<IEncoderService>(Base62EncoderService);
  });

  it('should be defined', () => {
    // Act & Assert
    expect(service).toBeDefined();
    expect(configServiceMock.get).toHaveBeenCalledTimes(2);
    expect(configServiceMock.get).toHaveBeenCalledWith('URL_ENCODER_LENGTH');
    expect(configServiceMock.get).toHaveBeenCalledWith('URL_ENCODER_ALPHABET');
  });

  it('should throw an error if the ID is not a valid number', () => {
    // Arrange
    const id = 'not-a-number';

    // Act
    const result = service.encode(id);

    // Assert
    expect(result).toBeNull();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'The provided ID is not a valid number',
    );
  });

  it('should handle encoding errors from Sqids', () => {
    const id = '101112';
    const errorMessage = 'Mocked Sqids encoding failed';
    const sqidsEncodeSpy = jest
      .spyOn(Sqids.prototype, 'encode')
      .mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

    // Act
    const result = service.encode(id);

    expect(result).toBeNull();
    expect(mockLogger.error).toHaveBeenCalledWith(
      `Encoding failed: ${errorMessage}`,
    );
    expect(sqidsEncodeSpy).toHaveBeenCalledWith([+id]);
  });

  it('should encode a given number string', () => {
    // Arrange
    const decodedString = '1234567890';
    const encodedStringMock = 'PcHfYmv';
    const sqidsEncodeSpy = jest
      .spyOn(Sqids.prototype, 'encode')
      .mockReturnValueOnce(encodedStringMock);

    // Act
    const result = service.encode(decodedString);

    // Assert
    expect(result).toBe(encodedStringMock);
    expect(sqidsEncodeSpy).toHaveBeenCalledWith([+decodedString]);
  });

  it('should decode a given string', () => {
    // Arrange
    const encodedString = 'PcHfYmv';
    const decodedStringMock = '1234567890';
    const sqidsDecodeSpy = jest
      .spyOn(Sqids.prototype, 'decode')
      .mockReturnValueOnce([+decodedStringMock]);

    // Act
    const result = service.decode(encodedString);

    expect(result).toBe(decodedStringMock);
    expect(sqidsDecodeSpy).toHaveBeenCalledWith(encodedString);
  });

  it('should handle decoding errors from Sqids', () => {
    // Arrange
    const encodedId = 'invalidEncodedId';
    const errorMessage = 'Mocked Sqids decoding failed';

    const sqidsDecodeSpy = jest
      .spyOn(Sqids.prototype, 'decode')
      .mockImplementation(() => {
        throw new Error(errorMessage);
      });

    // Act
    const result = service.decode(encodedId);

    // Assert
    expect(result).toBeNull();
    expect(mockLogger.error).toHaveBeenCalledWith(
      `Decoding failed: ${errorMessage}`,
    );
    expect(sqidsDecodeSpy).toHaveBeenCalledWith(encodedId);
  });
});
