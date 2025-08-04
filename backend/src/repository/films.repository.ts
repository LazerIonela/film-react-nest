import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDTO } from 'src/films/dto/films.dto';
import { Film, FilmDocument } from 'src/films/films.schema';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<FilmDTO[]> {
    return await this.filmModel.find();
  }
  async findById(id: string): Promise<FilmDocument | null> {
    return await this.filmModel.findOne({ id });
  }
  async updateFilmSession(
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ): Promise<void> {
    await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $set: { 'schedule.$.taken': takenSeats } },
    );
  }
}
