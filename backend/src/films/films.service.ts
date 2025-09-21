import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AppRepository } from '../app.repository.module';

@Injectable()
export class FilmsService {
  constructor(@Inject('REPOSITORY') private repository: AppRepository) {}

  async getAllFilms() {
    return await this.repository.films.findAll();
  }

  async getFilmSchedule(id: string) {
    const film = await this.repository.films.findById(id);
    if (!film) {
      throw new NotFoundException('Film not found');
    }
    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }
}
