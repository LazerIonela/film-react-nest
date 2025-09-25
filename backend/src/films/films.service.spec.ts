import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { fixtures } from './films.fixtures';
import { FilmsRepository } from '../repository/films.postgres.typeorm.repository';

describe('FilmsService', () => {
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue(fixtures.films.items),
            findById: jest.fn().mockImplementation((id: string) => {
              return Promise.resolve(
                fixtures.films.items.find((f) => f.id === id),
              );
            }),
          },
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
