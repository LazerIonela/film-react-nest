import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Ticket {
  @Prop({ required: true })
  film: string;
  @Prop({ required: true })
  session: string;
  @Prop({ required: true })
  dayTime: string;
  @Prop({ required: true })
  day: string;
  @Prop({ required: true })
  time: string;
  @Prop({ required: true })
  hall: number;
  @Prop({ required: true })
  row: number;
  @Prop({ required: true })
  seat: number;
  @Prop({ required: true })
  price: number;
}
export const TicketSchema = SchemaFactory.createForClass(Ticket);

@Schema()
export class Order {
  @Prop({ type: [TicketSchema], default: [] })
  tickets: Ticket[];
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  phone: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
