import { Message } from "node-nats-streaming";
import { Events, Errors } from "@encuentradepa/common";

import { QueueGroupName } from "./constants";
import { Ticket } from "../../models";

class TicketUpdated extends Events.Listener<Events.Types.TicketUpdated> {
  readonly subject = Events.Subjects.TicketUpdated;
  queueGroupName = QueueGroupName;

  async onMessage(data: Events.Types.TicketUpdated["data"], message: Message) {
    try {
      const ticket = await Ticket.findAndUpdateIfVersion(data);

      if (!ticket) {
        throw new Errors.NotFoundError();
      }

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

export { TicketUpdated };
