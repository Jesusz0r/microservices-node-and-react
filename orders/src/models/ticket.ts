import mongoose, { Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Events } from "@encuentradepa/common";

import { Order } from "./order";

interface TicketAttributes {
  _id: string;
  title: string;
  price: number;
}

interface TicketDocument extends Document {
  _id: string;
  title: string;
  price: number;
  version: number;

  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDocument> {
  build(ticket: TicketAttributes): TicketDocument;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics = {
  build: function (ticket: TicketAttributes): TicketDocument {
    const { _id, ...data } = ticket;

    return this.create({ _id, ...data });
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
