import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from './entity/url.entity';
import { configSchema } from './config/config.schema';
import { ConfigModule } from '@nestjs/config';
import { UrlRepositoryAdapter } from './adapter/output/repository/url-repository-adapter.service';
import { UrlController } from './adapter/input/controller/url.controller';
import { UrlService } from '../application/services/url.service';
import { IEncoderService } from '../domain/port/inbound/encoder.interface';
import { IUrlRepository } from '../domain/port/outbound/url-repository.interface';
import { Base62EncoderService } from '../application/services/base62-encoder.service';
import { UrlDatabaseModule } from './config/database/url-database.module';
import { AppLogger } from './config/log/console.logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: configSchema,
    }),
    UrlDatabaseModule,
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
  ],
  controllers: [UrlController],
})
export class InfrastructureModule {}
