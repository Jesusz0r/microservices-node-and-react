import { Message } from "node-nats-streaming";
import { Errors, Events } from "@encuentradepa/common";

import { queueGroupName } from "./contants";
import { TicketUpdated } from "../publishers/ticket-updated";
import { Ticket } from "../../models";

class OrderCancelled extends Events.Listener<Events.EventTypes.OrderCancelled> {
  readonly subject = Events.Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: Events.EventTypes.OrderCreated["data"],
    message: Message
  ) {
    const { ticket: orderTicket, id } = data;

    try {
      const ticket = await Ticket.findOne({ _id: orderTicket.id });
      const ticketUpdatedPublisher = new TicketUpdated(this.client);

      if (!ticket) {
        throw new Errors.NotFoundError();
      }

      ticket.set("orderId", undefined);

      await ticket.save();
      await ticketUpdatedPublisher.publish({
        id: String(ticket._id),
        title: ticket.title,
        price: ticket.price,
        userId: String(ticket.userId),
        orderId: String(ticket.orderId),
        version: ticket.version,
      });

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

export { OrderCancelled };
