import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheDatabaseModule } from './cache-database.module';
import { mysqlClientFactory } from './factory/mysql-client.factory';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: mysqlClientFactory,
      inject: [ConfigService],
    }),
    CacheDatabaseModule,
  ],
})
export class UrlDatabaseModule {}
