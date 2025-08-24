import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/films.entity';
import { Schedule } from 'src/films/films.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film) private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return await this.filmRepository.find({
      relations: ['schedules'],
    });
  }
  async findById(id: string): Promise<Film | null> {
    return await this.filmRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });
  }
  async updateFilmSession(film: Film): Promise<void> {
    try {
      await this.filmRepository.save(film);
    } catch (error) {
      new BadRequestException(`Не удалось обновить фильм ${film.title}`);
    }
  }
}
