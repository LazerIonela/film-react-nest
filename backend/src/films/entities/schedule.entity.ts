import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Film } from './films.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column({ type: 'double precision' })
  price: number;

  @Column('text', { array: true, default: '{}' })
  taken: string[];

  @ManyToOne(() => Film, (film) => film.schedules)
  @JoinColumn({ name: 'filmId' })
  film: Film;

  @Column()
  filmId: string;
}
