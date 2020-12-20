import { Message } from "node-nats-streaming";
import { Errors, Events } from "@encuentradepa/common";

import { QueueGroupName } from "./constants";
import { Order } from "../../models";
import { BadRequestError } from "@encuentradepa/common/build/errors";

class OrderCancelled extends Events.Listener<Events.EventTypes.OrderCancelled> {
  readonly subject = Events.Subjects.OrderCancelled;
  queueGroupName = QueueGroupName;

  async onMessage(
    data: Events.EventTypes.OrderCancelled["data"],
    message: Message
  ) {
    const { id, version } = data;
    const order = await Order.findOne({ _id: id, version: version - 1 });

    if (!order) {
      throw new Errors.NotFoundError();
    }

    if (
      order.status === Events.Status.OrderStatus.Completed ||
      order.status === Events.Status.OrderStatus.Cancelled
    ) {
      throw new BadRequestError();
    }

    order.set("status", Events.Status.OrderStatus.Cancelled);

    await order.save();
    await message.ack();
  }
}

export { OrderCancelled };
