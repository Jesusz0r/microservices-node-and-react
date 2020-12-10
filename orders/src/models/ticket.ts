import mongoose, { Document, Model } from "mongoose";

interface TicketAttributes {
  title: string;
  price: number;
}

interface TicketDocument extends Document {
  title: string;
  price: number;
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
    return this.create(ticket);
  },
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket, TicketDocument };
