import { CreateOrderDTO, TicketDetailDTO } from './dto/order.dto';
import { fixtures as filmFixtures } from '../films/films.fixtures';

// Используем реальный ID сеанса из фикстуры фильма
const ticket: TicketDetailDTO = {
  film: filmFixtures.film.title,
  session: filmFixtures.film.schedule[0].id, // UUID из фильма
  dayTime: filmFixtures.film.schedule[0].daytime,
  row: 1,
  seat: 2,
  price: filmFixtures.film.schedule[0].price,
};

const order: CreateOrderDTO = {
  tickets: [ticket],
  email: 'test@example.com',
  phone: '+79001234567',
};

const orderResponse = {
  total: 1,
  items: [ticket],
};

export const fixtures = {
  ticket,
  order,
  orderResponse,
};
