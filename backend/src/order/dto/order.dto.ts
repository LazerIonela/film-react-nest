//TODO реализовать DTO для /orders
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsString,
  IsPhoneNumber,
  IsDateString,
} from 'class-validator';

export class TicketDetailDTO {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsDateString()
  dayTime: string;

  @IsNumber()
  row: number;

  @IsNumber()
  seat: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDTO {
  @IsArray()
  tickets: TicketDetailDTO[];

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;
}

export class OrderResponseDTO {
  @IsNumber()
  total: number;

  @IsArray()
  items: TicketDetailDTO[];
}
