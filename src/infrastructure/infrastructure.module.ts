import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from './entity/url.entity';
import { configSchema } from '../domain/schema/config.schema';
import { ConfigModule } from '@nestjs/config';
import { UrlRepositoryAdapter } from './adapter/output/repository/url-repository.adapter';
import { UrlController } from './adapter/input/controller/url.controller';
import { UrlService } from '../application/services/url.service';
import { IEncoderService } from '../domain/port/input/encoder.interface';
import { IUrlRepository } from '../domain/port/output/url-repository.interface';
import { Base62EncoderService } from '../application/services/base62-encoder.service';
import { UrlDatabaseModule } from './config/database/url-database.module';
import { AppLogger } from './config/log/console.logger';
import { CacheDatabaseModule } from './config/database/cache-database.module';
import { CacheRepositoryAdapter } from './adapter/output/repository/cache-repository.adapter';
import { ICacheRepository } from '../domain/port/output/cache-repository.interface';

const envFilePath = `.env.${process.env.NODE_ENV}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: configSchema,
    }),
    UrlDatabaseModule,
    CacheDatabaseModule,
    TypeOrmModule.forFeature([UrlEntity]),
  ],
  providers: [
    AppLogger,
    UrlService,
    {
      provide: IEncoderService,
      useClass: Base62EncoderService,
    },
    {
      provide: IUrlRepository,
      useClass: UrlRepositoryAdapter,
    },
    {
      provide: ICacheRepository,
      useClass: CacheRepositoryAdapter,
    },
  ],
  controllers: [UrlController],
})
export class InfrastructureModule {}
