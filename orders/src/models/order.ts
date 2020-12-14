import mongoose, { Document, Model, ObjectId } from "mongoose";
import { Events } from "@encuentradepa/common";

import { TicketDocument } from "./ticket";

interface OrderAttributes {
  userId: string;
  status: Events.Status.OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

interface OrderDocument extends Document {
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDocument;

  setCancelStatus(): Promise<OrderDocument>;
}

interface OrderModel extends Model<OrderDocument> {
  build(order: OrderAttributes): OrderDocument;
}

const ordersSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  status: {
    type: String,
    required: true,
    enum: Object.values(Events.Status.OrderStatus),
    default: Events.Status.OrderStatus.Created,
  },
  expiresAt: { type: mongoose.Schema.Types.Date },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
});

ordersSchema.statics = {
  build: function (order: OrderAttributes): OrderDocument {
    return this.create(order);
  },
};
ordersSchema.methods = {
  setCancelStatus: async function (): Promise<OrderDocument> {
    this.set("status", Events.Status.OrderStatus.Cancelled);

    return this.save();
  },
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", ordersSchema);

export { Order };
