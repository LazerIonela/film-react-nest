//TODO реализовать DTO для /orders
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsString,
  IsPhoneNumber,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TicketDetailDTO {
  @IsString()
  id: string;

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
  @ValidateNested({ each: true })
  @Type(() => TicketDetailDTO)
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
  @ValidateNested({ each: true })
  @Type(() => TicketDetailDTO)
  items: TicketDetailDTO[];
}
