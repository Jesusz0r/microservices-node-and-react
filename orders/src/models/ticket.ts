import mongoose, { Document, Model } from "mongoose";
import { Events } from "@encuentradepa/common";

import { Order } from "./order";

interface TicketAttributes {
  id: string;
  title: string;
  price: number;
}

interface TicketDocument extends Document {
  id: string;
  title: string;
  price: number;
  version: number;

  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDocument> {
  build(ticket: TicketAttributes): TicketDocument;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret._id;
      },
    },
  }
);

ticketSchema.statics = {
  build: function (ticket: TicketAttributes): TicketDocument {
    const { id, ...data } = ticket;

    return this.create({ _id: id, ...data });
  },
};
ticketSchema.methods = {
  isReserved: async function (): Promise<boolean> {
    const isReserved = await Order.findOne({
      ticket: this,
      status: {
        $in: [
          Events.Status.OrderStatus.AwaitingPayment,
          Events.Status.OrderStatus.Created,
          Events.Status.OrderStatus.Completed,
        ],
      },
    });

    return !!isReserved;
  },
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket, TicketDocument };
