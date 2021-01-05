import { Message } from "node-nats-streaming";
import { Errors, Events } from "@encuentradepa/common";

import { QueueGroupName } from "./constants";
import { OrderCancelled } from "../publishers/order-cancelled";
import { Order } from "../../models";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleted extends Events.Listener<Events.Types.ExpirationCompleted> {
  readonly subject = Events.Subjects.ExpirationCompleted;
  queueGroupName = QueueGroupName;

  async onMessage(
    data: Events.Types.ExpirationCompleted["data"],
    message: Message
  ) {
    const { orderId } = data;
    const order = await Order.findOne({ _id: orderId }).populate("ticket");
    const orderCancelledPublisher = new OrderCancelled(natsWrapper.client);

    if (!order) {
      throw new Errors.NotFoundError();
    }

    if (order.status === Events.Status.Order.Completed) {
      return message.ack();
    }

    order.set("status", Events.Status.Order.Cancelled);

    await order.save();
    await orderCancelledPublisher.publish({
      id: order._id,
      version: order.version,
      ticket: {
        id: order.ticket._id,
      },
    });

    message.ack();
  }
}
