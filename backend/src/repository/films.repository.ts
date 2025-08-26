import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/films.entity';
import { Schedule } from '../films/entities/schedule.entity';

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
  async findById(filmId: string): Promise<Film | null> {
    return await this.filmRepository.findOne({
      where: { id: filmId },
      relations: ['schedules'],
    });
  }

  async findScheduleById(sessionId: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId },
    });
    if (!schedule)
      throw new NotFoundException(`Сеанс с id ${sessionId} не найден`);
    return schedule;
  }

  async updateFilmSession(sessionId: string, taken: string[]): Promise<void> {
    await this.scheduleRepository.update(sessionId, { taken });
    console.log({ sessionId, taken });
  }
}
