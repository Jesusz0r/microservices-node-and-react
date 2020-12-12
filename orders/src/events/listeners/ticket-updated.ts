import { Message } from "node-nats-streaming";
import { Events } from "@encuentradepa/common";

import { QueueGroupName } from "./constants";
import { Ticket } from "../../models";

class TicketUpdated extends Events.Listener<Events.EventTypes.TicketUpdated> {
  readonly subject = Events.Subjects.TicketUpdated;
  queueGroupName = QueueGroupName;

  async onMessage(
    data: Events.EventTypes.TicketUpdated["data"],
    message: Message
  ) {
    try {
      const { id, title, price } = data;

      await Ticket.findOneAndUpdate(
        { _id: id },
        { title, price },
        { new: true, omitUndefined: true }
      );

      message.ack();
    } catch (error) {
      console.error(error);
    }
  }
}

export { TicketUpdated };
