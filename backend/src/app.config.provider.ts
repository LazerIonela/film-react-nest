import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';

export const configProvider = {
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    database: {
      driver: process.env.DATABASE_DRIVER ?? 'postgres',
      url: process.env.DATABASE_URL ?? 'postgres:///',
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}
