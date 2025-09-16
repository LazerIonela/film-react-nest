import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { FilmsRepository } from '../repository/films.repository';
import { fixtures as filmFixtures } from '../films/films.fixtures';
import { fixtures } from './order.fixtures';
import { BadRequestException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  const mockFilmsRepository = {
    findById: jest.fn(),
    updateFilmSession: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        { provide: FilmsRepository, useValue: mockFilmsRepository },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should succeed if seat is empty', async () => {
    const filmFree = {
      ...filmFixtures.film,
      schedules: filmFixtures.film.schedules.map((s) => ({ ...s, taken: [] })),
    };

    mockFilmsRepository.findById.mockResolvedValue(filmFree);

    const res = await controller.createOrder(fixtures.order);

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
        taken: ['1:2'],
      })),
    };

    mockFilmsRepository.findById.mockResolvedValue(filmTaken);

    await expect(controller.createOrder(fixtures.order)).rejects.toThrow(
      BadRequestException,
    );
  });
});
