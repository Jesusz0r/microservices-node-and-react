import { Message } from "node-nats-streaming";
import { Events } from "@encuentradepa/common";

import { QueueGroupName } from "./constants";
import { expirationQueue } from "../../queues/expiration-queue";

class OrderCreated extends Events.Listener<Events.EventTypes.OrderCreated> {
  readonly subject = Events.Subjects.OrderCreated;
  queueGroupName = QueueGroupName;

  async onMessage(
    data: Events.EventTypes.OrderCreated["data"],
    message: Message
  ) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add({ orderId: data.id }, { delay });
    message.ack();
  }
}

export { OrderCreated };
