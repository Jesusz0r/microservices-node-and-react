import mongoose from "mongoose";

// // Interfaz que define las propiedades necesarias para crear un nuevo usuario
interface TicketAttributes {
  title: string;
  price: number;
  userId: mongoose.Types.ObjectId;
}

// // Interfaz que describe las propiedades que tendrá el documento creado
// // cuando creamos un nuevo usuario en mongo
interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: mongoose.Types.ObjectId;
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
      type: mongoose.Types.ObjectId,
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

const Ticket = mongoose.model<TicketDocument>("Ticket", ticketSchema);

export { Ticket };
