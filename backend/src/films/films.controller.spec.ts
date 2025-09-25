import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { fixtures } from './films.fixtures';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  beforeEach(async () => {
    const mockFilmsService = {
      getAllFilms: jest.fn().mockResolvedValue(fixtures.films),
      getFilmSchedule: jest.fn().mockResolvedValue(fixtures.film.schedule),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all films', async () => {
    const result = await controller.getAllFilms();
    expect(result).toEqual(fixtures.films);
    expect(filmsService.getAllFilms).toHaveBeenCalled();
  });

  it('should get film schedule', async () => {
    const schedule = await controller.getFilmSchedule(fixtures.film.id);
    expect(schedule).toEqual(fixtures.film.schedule);
    expect(filmsService.getFilmSchedule).toHaveBeenCalledWith(fixtures.film.id);
  });
});
