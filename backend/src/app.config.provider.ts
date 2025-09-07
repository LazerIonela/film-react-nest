import { ConfigModule } from '@nestjs/config';

export const ConfigToken = 'CONFIG';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: ConfigToken,
  useValue: <AppConfig>{
    database: {
      driver: process.env.DATABASE_DRIVER || 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: process.env.DATABASE_PORT || 5432,
      username: process.env.DATABASE_USERNAME || 'student',
      password: process.env.DATABASE_PASSWORD || 'student',
    },
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
