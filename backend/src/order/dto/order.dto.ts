//TODO реализовать DTO для /orders
export class TicketDetailDTO {
  film: string;
  session: string;
  dayTime: string;
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderDTO {
  tickets: TicketDetailDTO[];
  email: string;
  phone: string;
}

export class OrderResponseDTO {
  total: number;
  items: TicketDetailDTO[];
}
