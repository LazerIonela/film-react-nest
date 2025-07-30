import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { FilmDTO, ScheduleDTO } from 'src/films/dto/films.dto';
import { Film, FilmDocument } from 'src/films/films.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private filmsModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<Film[]> {
    return await this.filmsModel.find();
  }
  async findById(id: string): Promise<Film | null> {
    return await this.filmsModel.findById(id);
  }
}
