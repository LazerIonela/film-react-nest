import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CreateOrderDTO,
  // CreateOrderDTO,
  OrderResponseDTO,
  TicketDetailDTO,
} from './dto/order.dto';
import { FilmsRepository } from 'src/repository/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  // async createOrder(tickets: TicketDetailDTO[]): Promise<OrderResponseDTO> {
  async createOrder(order: CreateOrderDTO): Promise<OrderResponseDTO> {
    const orderTickets: TicketDetailDTO[] = [];

    for (const ticket of order.tickets) {
      const { film, session, row, seat } = ticket;

      const currentFilm = await this.filmsRepository.findById(film);

      if (!currentFilm) {
        throw new BadRequestException(`Фильм с id=${film} не найден`);
      }
      const schedule = currentFilm.schedules.find((s) => s.id === session);
      if (!schedule) {
        throw new BadRequestException(`Сеанс с id ${session} не найден`);
      }
      const seatKey = `${row}:${seat}`;

      if (schedule.taken?.includes(seatKey)) {
        throw new BadRequestException(`Место ${seatKey} занято`);
      }

      schedule.taken = schedule.taken
        ? `${schedule.taken},${seatKey}`
        : seatKey;

      await this.filmsRepository.updateFilmSession(session, schedule.taken);
      orderTickets.push({
        film,
        session,
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
