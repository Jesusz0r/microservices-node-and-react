import { Message } from "node-nats-streaming";
import { Events } from "@encuentradepa/common";

import { QueueGroupName } from "./constants";
import { Ticket } from "../../models";

class TicketCreated extends Events.Listener<Events.EventTypes.TicketCreated> {
  readonly subject = Events.Subjects.TicketCreated;
  queueGroupName = QueueGroupName;

  async onMessage(
    data: Events.EventTypes.TicketCreated["data"],
    message: Message
  ) {
    try {
      const { id, title, price } = data;

      await Ticket.build({ id, title, price });

      message.ack();
    } catch (error) {
      console.error(error);
    }
  }
}

export { TicketCreated };
