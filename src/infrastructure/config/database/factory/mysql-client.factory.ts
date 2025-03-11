import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UrlEntity } from '../../../entity/url.entity';

export const mysqlClientFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  database: configService.get<string>('DATABASE_NAME'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  logging: configService.get<boolean>('DATABASE_LOGGING_ENABLED') || false,
  entities: [UrlEntity],
  synchronize: false,
  migrationsRun: false,
});
