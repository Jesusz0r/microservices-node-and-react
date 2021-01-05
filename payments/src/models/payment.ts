import mongoose, { Document, Model } from "mongoose";

interface PaymentAttributes {
  orderId: string;
  stripeId: string;
}

interface PaymentDocument extends Document {
  orderId: string;
  stripeId: string;
}
interface PaymentModel extends Model<PaymentDocument> {
  build(payment: PaymentAttributes): Promise<PaymentDocument>;
}

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
  },
});

paymentSchema.statics = {
  build: function (payment: PaymentAttributes) {
    return this.create(payment);
  },
};

const Payment = mongoose.model<PaymentDocument, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
