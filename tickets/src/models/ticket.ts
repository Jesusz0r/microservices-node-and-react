import mongoose, { Document, Model } from "mongoose";

// // Interfaz que define las propiedades necesarias para crear un nuevo usuario
interface TicketAttributes {
  title: string;
  price: number;
  userId: mongoose.Schema.Types.ObjectId;
}

// // Interfaz que describe las propiedades que tendrá el documento creado
// // cuando creamos un nuevo usuario en mongo
interface TicketDocument extends Document {
  title: string;
  price: number;
  userId: mongoose.Schema.Types.ObjectId;
}

interface TicketModel extends Model<TicketDocument> {
  build(ticket: TicketAttributes): TicketDocument;
}

const ticketSchema: mongoose.Schema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret.__v;
        delete ret._id;
      },
    },
  }
);
ticketSchema.statics = {
  build: function (ticket: TicketAttributes): TicketDocument {
    return this.create({ ticket });
  },
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket };
