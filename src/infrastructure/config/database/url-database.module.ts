import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
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
