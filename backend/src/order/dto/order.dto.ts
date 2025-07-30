//TODO реализовать DTO для /orders
export class TicketDetailDTO {
  id: string;
  film: string;
  session: string;
  dayTime: Date;
  hall: number;
  price: number;
  taken: string[]; //показывает выбранные ряды и места
}

export class createOrderDTO {
  tickets: TicketDetailDTO[];
  email: string;
  phone: string;
}
