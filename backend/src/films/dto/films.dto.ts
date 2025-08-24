//TODO описать DTO для запросов к /films
import { IsArray, IsNumber, IsString, IsDateString } from 'class-validator';

export class FilmDTO {
  @IsString()
  id: string;

  @IsNumber()
  rating: number;

  @IsString()
  director: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  image: string;

  @IsString()
  cover: string;

  @IsString()
  title: string;

  @IsString()
  about: string;

  @IsString()
  description: string;

  @IsArray()
  schedules: ScheduleDTO[];
}

export class ScheduleDTO {
  @IsString()
  id: string;

  @IsDateString()
  daytime: string;

  @IsNumber()
  hall: number;

  @IsNumber()
  rows: number;

  @IsNumber()
  seats: number;

  @IsNumber()
  price: number;

  @IsArray()
  @IsString({ each: true })
  taken: string[];
}

export class FilmResponseDTO {
  @IsNumber()
  total: number;

  @IsArray()
  items: FilmDTO[];
}

export class ScheduleResponseDTO {
  @IsNumber()
  total: number;

  @IsArray()
  items: ScheduleDTO[];
}
