import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  // async getAllFilms() {
  //   return await this.filmsService.getAllFilms();
  // }
  async getAllFilms() {
    const res = await this.filmsService.getAllFilms(); // { total, items }
    return (res?.items ?? []).map((f: any) => ({
      ...f,
      // фронту нужно schedules; у нас в entity поле называется schedule
      schedules: Array.isArray(f?.schedules)
        ? f.schedules
        : Array.isArray(f?.schedule)
          ? f.schedule
          : [],
    }));
  }

  @Get(':id/schedule')
  // async getFilmSchedule(@Param('id') id: string) {
  //   return await this.filmsService.getFilmSchedule(id);
  // }
  // }
  async getFilmSchedule(@Param('id') id: string) {
    // если сервис возвращает FilmDTO — отдадим только расписание
    const film = await this.filmsService.getFilmSchedule(id);
    const schedules = (film as any)?.schedules ?? (film as any)?.schedule ?? [];
    return Array.isArray(schedules) ? schedules : [];
  }
}
