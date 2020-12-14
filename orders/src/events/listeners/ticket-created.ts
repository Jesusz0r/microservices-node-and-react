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
    const { id, title, price } = data;

    try {
      await Ticket.build({ _id: id, title, price });

      message.ack();
    } catch (error) {
      console.error(
        `Error: ${
          error.message
        } - EventId: ${message.getSequence()} - EventSubject: ${
          this.subject
        } - Queue: ${this.queueGroupName}.`
      );
    }
  }
}

export { TicketCreated };
