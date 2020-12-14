import { Message } from "node-nats-streaming";
import { Events, Errors } from "@encuentradepa/common";

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
      const { id, title, price, version } = data;
      const ticket = await Ticket.findOne({ _id: id, version: version - 1 });

      if (!ticket) {
        throw new Errors.BadRequestError();
      }

      ticket.set("title", title || ticket.title);
      ticket.set("price", price || ticket.price);

      await ticket.save();

      message.ack();
    } catch (error) {
      console.error(error);
    }
  }
}

export { TicketUpdated };
