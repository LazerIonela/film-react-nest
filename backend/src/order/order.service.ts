import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  OrderResponseDTO,
  TicketDetailDTO,
  CreateOrderDTO,
} from './dto/order.dto';
import { FilmsRepository } from 'src/repository/films.repository';
@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(orderDto: CreateOrderDTO): Promise<OrderResponseDTO> {
    const items: TicketDetailDTO[] = [];

    for (const ticket of orderDto.tickets) {
      const { film, session, row, seat, price, dayTime } = ticket;
      const seatKey = `${row}:${seat}`;

      const filmEntity = await this.filmsRepository.findById(film);
      if (!filmEntity) {
        throw new NotFoundException(`Фильм с id ${film} не найден`);
      }

      const schedule = await this.filmsRepository.findScheduleById(session);

      // Проверяем занятость места
      schedule.taken = schedule.taken || [];
      if (schedule.taken.includes(seatKey)) {
        throw new ConflictException(
          `Место ${seatKey} уже занято на сеансе ${session}`,
        );
      }

      // Добавляем место в taken и сохраняем
      schedule.taken.push(seatKey);
      await this.filmsRepository.updateFilmSession(session, schedule.taken);

      items.push({ film, session, dayTime, row, seat, price });
    }

    const total = items.reduce((sum, ticket) => sum + ticket.price, 0);

    return { total, items };
  }
}
