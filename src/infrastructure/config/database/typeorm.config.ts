import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config({
  path: '.env.development',
});

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 3306,
  database: process.env.DATABASE_NAME || 'database_name',
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || 'root_pwd',
  entities: ['**/*.entity.ts'],
  migrations: ['./src/**/migrations/*-migration.ts'],
  synchronize: false,
  migrationsRun: false,
  logging: true,
};

export default new DataSource(dataSourceOptions);
