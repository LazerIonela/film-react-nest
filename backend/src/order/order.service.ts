import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { OrderResponseDTO, TicketDetailDTO } from './dto/order.dto';
import { FilmsRepository } from 'src/repository/films.repository';
import { FilmDTO } from 'src/films/dto/films.dto';
@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(tickets: TicketDetailDTO[]): Promise<OrderResponseDTO> {
    const updatedFilms = new Map<string, FilmDTO>();
    const orderTickets: TicketDetailDTO[] = [];

    for (const ticket of tickets) {
      const {
        film: filmId,
        session: sessionId,
        dayTime,
        row,
        seat,
        price,
      } = ticket;

      let film = updatedFilms.get(filmId);
      if (!film) {
        film = await this.filmsRepository.findById(filmId);
        if (!film) {
          throw new NotFoundException(`Фильм не найден: ${filmId}`);
        }
        updatedFilms.set(filmId, film);
      }

      const schedule = film.schedules.find((s) => s.id === sessionId);
      if (!schedule) {
        throw new NotFoundException(`Сеанс не найден: ${sessionId}`);
      }

      const seatKey = `${row}:${seat}`;

      if (!Array.isArray(schedule.taken)) {
        schedule.taken = [];
      }

      if (schedule.taken.includes(seatKey)) {
        throw new ConflictException(`Место ${seatKey} уже занято`);
      }

      schedule.taken.push(seatKey);

      orderTickets.push({
        film: filmId,
        session: sessionId,
        dayTime,
        row,
        seat,
        price,
      });
    }

    return {
      total: orderTickets.length,
      items: orderTickets,
    };
  }
}
