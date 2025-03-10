import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UrlEntity } from '../../entity/url.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DATABASE_NAME'),
        entities: [UrlEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class UrlDatabaseModule {}
