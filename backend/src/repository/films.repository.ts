import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/films.entity';
import { Schedule } from '../films/entities/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film) private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
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

  async updateFilmSession(sessionId: string, taken: string): Promise<void> {
    await this.scheduleRepository.update(sessionId, { taken });
    console.log({ sessionId, taken });
  }
}
