import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  CreateOrderDTO,
  OrderResponseDTO,
  TicketDetailDTO,
} from './dto/order.dto';
import { AppRepository } from '../app.repository.module';

@Injectable()
export class OrderService {
  constructor(
    @Inject('REPOSITORY') private readonly repository: AppRepository,
  ) {}

  async createOrder(order: CreateOrderDTO): Promise<OrderResponseDTO> {
    const orderTickets: TicketDetailDTO[] = [];

    for (const ticket of order.tickets) {
      const { film: filmId, session: sessionId, row, seat } = ticket;

      const currentFilm = await this.repository.films.findById(filmId);

      if (!currentFilm) {
        throw new BadRequestException(`Фильм с id=${filmId} не найден`);
      }
      const schedule = currentFilm.schedule.find((s) => s.id === sessionId);
      if (!schedule) {
        throw new BadRequestException(`Сеанс с id ${sessionId} не найден`);
      }
      const seatKey = `${row}:${seat}`;
      const taken = Array.isArray(schedule.taken) ? schedule.taken : [];

      if (taken.includes(seatKey)) {
        throw new BadRequestException(`Место ${seatKey} занято`);
      }

      const updatedTaken = [...(schedule.taken ?? []), seatKey];

      const updatedSchedules = currentFilm.schedule.map((s) =>
        s.id === sessionId ? { ...s, taken: updatedTaken } : s,
      );

      await this.repository.films.updateFilmSession({
        ...currentFilm,
        id: filmId,
        schedule: updatedSchedules,
      });

      orderTickets.push({
        film: filmId,
        session: sessionId,
        row,
        seat,
        dayTime: schedule.daytime,
        price: schedule.price,
      });
    }

    return {
      total: orderTickets.length,
      items: orderTickets,
    };
  }
}
