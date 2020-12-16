import mongoose, { Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// // Interfaz que define las propiedades necesarias para crear un nuevo usuario
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

// // Interfaz que describe las propiedades que tendrá el documento creado
// // cuando creamos un nuevo usuario en mongo
interface TicketDocument extends Document {
  title: string;
  price: number;
  userId: string;
  orderId?: string;

  version: number;
}

interface TicketModel extends Model<TicketDocument> {
  build(ticket: TicketAttributes): TicketDocument;
}

const ticketSchema: mongoose.Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  orderId: mongoose.Schema.Types.ObjectId,
});

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics = {
  build: function (ticket: TicketAttributes): TicketDocument {
    return this.create(ticket);
  },
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket };
