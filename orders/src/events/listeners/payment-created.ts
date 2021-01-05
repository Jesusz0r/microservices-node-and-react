import { Message } from "node-nats-streaming";
import { Errors, Events } from "@encuentradepa/common";

import { QueueGroupName } from "./constants";
import { Order } from "../../models";

export class PaymentCreated extends Events.Listener<Events.Types.PaymentCreated> {
  readonly subject = Events.Subjects.PaymentCreated;
  queueGroupName = QueueGroupName;

  async onMessage(data: Events.Types.PaymentCreated["data"], message: Message) {
    const order = await Order.findOne({ _id: data.orderId });

    if (!order) {
      throw new Errors.NotFoundError();
    }

    order.set("status", Events.Status.Order.Completed);

    await order.save();

    // Debido a que actualizamos la orden, faltaría publicar un evento a los otros servicios avisandole que la orden ya está completada.

    await message.ack();
  }
}
