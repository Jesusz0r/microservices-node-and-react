import mongoose, { Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Events } from "@encuentradepa/common";

interface OrderAttributes {
  _id: string;
  status: Events.Status.Order;
  userId: string;
  price: number;
  version: number;
}

interface OrderDocument extends Document {
  _id: string;
  status: Events.Status.Order;
  userId: string;
  price: number;
  version: number;
}

interface OrderModel extends Model<OrderDocument> {
  build(order: OrderAttributes): Promise<OrderDocument>;
}

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: Object.values(Events.Status.Order),
    required: true,
  },
  userId: { type: mongoose.Types.ObjectId, required: true },
  price: { type: Number, required: true },
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics = {
  build: function (order: OrderAttributes): Promise<OrderDocument> {
    return this.create(order);
  },
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
