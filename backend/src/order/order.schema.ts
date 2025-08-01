import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: true })
export class Ticket {
  @Prop({ required: true, unique: true })
  id: string;
  @Prop({ required: true })
  film: string;
  @Prop({ required: true })
  session: string;
  @Prop({ required: true })
  dayTime: Date;
  @Prop({ required: true })
  hall: number;
  @Prop({ required: true })
  price: number;
  @Prop({ type: [String], default: [] })
  taken: string[];
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
