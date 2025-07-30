import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
// import { ScheduleDTO, FilmDTO } from './dto/films.dto';
// import { Film, Schedule } from './films.schema';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getAllFilms() {
    const films = await this.filmsRepository.findAll();
    return films;
  }

  async getFilmSchedule(id: string) {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException('Film not found');
    }
    return film.schedule;
  }
}
