import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDTO, TicketDetailDTO } from './dto/order.dto';
import { FilmsRepository } from 'src/repository/films.repository';
import { faker } from '@faker-js/faker';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}
  async createOrder(orderData: CreateOrderDTO): Promise<TicketDetailDTO[]> {
    let tickets: TicketDetailDTO[] = [];
    for (const ticket of orderData.tickets) {
      const { film, session, row, seat } = ticket;
      const currentFilm = await this.filmsRepository.findById(film);
      if (!currentFilm) {
        throw new BadRequestException(`Фильм с id=${film} не найден`);
      }
      const schedule = currentFilm.schedules.find((s) => s.id === session);
      if (!schedule) {
        throw new BadRequestException(`Сеанс с id ${session} не найден`);
      }
      const takenSeat = `${row}:${seat}`;
      if (schedule.taken?.includes(takenSeat)) {
        throw new BadRequestException(`Место ${takenSeat} занято`);
      }
      schedule.taken = schedule.taken + ',' + takenSeat;

      await this.filmsRepository.updateFilmSession(
        film,
        session,
        schedule.taken,
      );
      tickets = [
        ...tickets,
        {
          id: faker.string.uuid(),
          film,
          session,
          row,
          seat,
          dayTime: schedule.daytime,
          price: schedule.price,
        },
      ];
    }
    return tickets;
  }
}
