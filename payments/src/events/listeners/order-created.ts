import { Message } from "node-nats-streaming";
import { Events } from "@encuentradepa/common";

import { QueueGroupName } from "./constants";
import { Order } from "../../models";

class OrderCreated extends Events.Listener<Events.Types.OrderCreated> {
  readonly subject = Events.Subjects.OrderCreated;
  queueGroupName = QueueGroupName;

  async onMessage(data: Events.Types.OrderCreated["data"], message: Message) {
    const { id, status, userId, version, ticket } = data;

    await Order.build({
      _id: id,
      status,
      userId,
      version,
      price: ticket.price,
    });
    await message.ack();
  }
}

export { OrderCreated };
