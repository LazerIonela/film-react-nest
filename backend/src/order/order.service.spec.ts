import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FilmsRepository } from '../repository/films.postgres.typeorm.repository';
import { fixtures as filmFixtures } from '../films/films.fixtures';
import { fixtures } from './order.fixtures';
import { BadRequestException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  const mockFilmsRepository = {
    findById: jest.fn(),
    updateFilmSession: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: FilmsRepository, useValue: mockFilmsRepository },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create order if seat is empty', async () => {
    const filmFree = {
      ...filmFixtures.film,
      schedules: filmFixtures.film.schedules.map((s) => ({ ...s, taken: [] })),
    };

    mockFilmsRepository.findById.mockResolvedValue(filmFree);

    const res = await service.createOrder(fixtures.order);

    expect(res).toEqual(fixtures.orderResponse);
    expect(mockFilmsRepository.findById).toHaveBeenCalledWith(
      fixtures.ticket.film,
    );
    expect(mockFilmsRepository.updateFilmSession).toHaveBeenCalled();
  });

  it('should fail if seat is busy', async () => {
    const filmTaken = {
      ...filmFixtures.film,
      schedules: filmFixtures.film.schedules.map((s) => ({
        ...s,
        taken: ['1:2'], // место занято
      })),
    };

    mockFilmsRepository.findById.mockResolvedValue(filmTaken);

    await expect(service.createOrder(fixtures.order)).rejects.toThrow(
      BadRequestException,
    );
  });
});
