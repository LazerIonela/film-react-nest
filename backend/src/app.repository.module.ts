import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfig } from './app.config.provider';
import { Film } from './films/entities/films.entity';
import { Schedule } from './films/entities/schedule.entity';
import { PostgresTypeOrmRepository } from './repository/postgres.typeorm.repository';
import { FilmsPostgresTypeOrmRepository } from './repository/films.postgres.typeorm.repository';
import { FilmDTO, FilmResponseDTO } from './films/dto/films.dto';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forRootAsync({
      imports: [forwardRef(() => AppModule)],
      useFactory: async (appConfig: AppConfig) => {
        const dbUrl = new URL(appConfig.database.url);
        return <TypeOrmModuleOptions>{
          type: appConfig.database.driver,
          host: dbUrl.hostname,
          port: dbUrl.port,
          database: dbUrl.pathname.substring(1),
          username: appConfig.database.username,
          password: appConfig.database.password,
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
      inject: [{ token: 'CONFIG', optional: false }],
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [
    FilmsPostgresTypeOrmRepository,
    {
      provide: 'PG_REPOSITORY',
      useClass: PostgresTypeOrmRepository,
    },
    {
      provide: 'REPOSITORY',
      useFactory: (config: AppConfig, pgRepo: AppRepository) => {
        return pgRepo;
      },
      inject: [
        { token: 'CONFIG', optional: false },
        { token: 'PG_REPOSITORY', optional: true },
      ],
    },
  ],
  exports: ['REPOSITORY'],
})
export class AppRepositoryModule {}

export interface AppRepository {
  films: FilmsRepository;
}

export interface FilmsRepository {
  findAll(): Promise<FilmResponseDTO>;
  findById(id: string): Promise<FilmDTO>;
  updateFilmSession(film: FilmDTO): Promise<string>;
}
