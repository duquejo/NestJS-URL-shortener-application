import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppLogger } from './infrastructure/config/log/console.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(ConfigService);

  app.useLogger(app.get(AppLogger));

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
}

bootstrap()
  .then((r) => r)
  .catch((err) => console.error(err));
