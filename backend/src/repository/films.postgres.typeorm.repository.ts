import { FilmsRepository } from '../app.repository.module';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/films.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmDTO, ScheduleDTO, FilmResponseDTO } from '../films/dto/films.dto';

export class FilmsPostgresTypeOrmRepository implements FilmsRepository {
  constructor(private filmRepository: Repository<Film>) {}

  async findAll(): Promise<FilmResponseDTO> {
    const films = await this.filmRepository.find({ relations: ['schedules'] });
    return {
      total: films.length,
      items: films.map(this.filmToDtoMapper()),
    };
  }
  async findById(id: string): Promise<FilmDTO> {
    const films = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });
    return films ? this.filmToDtoMapper()(films) : null;
  }

  async updateFilmSession(film: FilmDTO): Promise<string> {
    if (film.id) {
      const data = this.dtoToFilmMapper()(film);
      const entity = await this.filmRepository.preload(data);
      entity.schedule = data.schedule;
      await this.filmRepository.save(entity);
      return film.id;
    } else {
    }
  }

  private filmToDtoMapper(): (Film) => FilmDTO {
    return (root: Film) => {
      return <FilmDTO>{
        id: root.id,
        description: root.description,
        director: root.director,
        rating: root.rating,
        tags: root.tags,
        image: root.image,
        cover: root.cover,
        title: root.title,
        about: root.about,
        schedule: root.schedule?.map(this.scheduleToDtoMapper()),
      };
    };
  }

  private scheduleToDtoMapper(): (Schedule) => ScheduleDTO {
    return (root: Schedule) => {
      return <ScheduleDTO>{
        id: root.id,
        taken: root.taken,
        hall: root.hall,
        daytime: root.daytime,
        rows: root.rows,
        seats: root.seats,
        price: root.price,
      };
    };
  }

  private dtoToFilmMapper(): (FilmDTO) => Film {
    return (dto: FilmDTO) => {
      return <Film>{
        id: dto.id,
        description: dto.description,
        director: dto.director,
        rating: dto.rating,
        tags: dto.tags,
        image: dto.image,
        cover: dto.cover,
        title: dto.title,
        about: dto.about,
        schedule: dto.schedule.map(this.dtoToScheduleMapper()),
      };
    };
  }

  private dtoToScheduleMapper(): (ScheduleDTO) => Schedule {
    return (dto: ScheduleDTO) => {
      return <Schedule>{
        price: dto.price,
        seats: dto.seats,
        rows: dto.rows,
        daytime: dto.daytime,
        hall: dto.hall,
        taken: dto.taken,
        id: dto.id,
      };
    };
  }
}
