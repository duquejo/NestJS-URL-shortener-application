import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configSchema } from '../domain/schema/config.schema';

import { UrlController } from './adapter/input/controller/url.controller';
import { CacheDatabaseModule } from './config/database/cache-database.module';
import { UrlDatabaseModule } from './config/database/url-database.module';
import { AppLogger } from './config/log/console.logger';
import { cqrsHandlerProvider } from './config/provider/cqrs-handler.provider';
import { repositoryProvider } from './config/provider/repository.provider';
import { servicesProvider } from './config/provider/service.provider';
import { InMemoryThrottlerModule } from './config/throttler/in-memory-throttler.module';
import { UrlEntity } from './entity/url.entity';

const envFilePath = `.env.${process.env.NODE_ENV}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: configSchema,
    }),
    TypeOrmModule.forFeature([UrlEntity]),
    CqrsModule.forRoot(),
    UrlDatabaseModule,
    CacheDatabaseModule,
    InMemoryThrottlerModule,
  ],
  providers: [
    AppLogger,
    ...cqrsHandlerProvider,
    ...servicesProvider,
    ...repositoryProvider,
  ],
  controllers: [UrlController],
  exports: [CqrsModule],
})
export class InfrastructureModule {}
