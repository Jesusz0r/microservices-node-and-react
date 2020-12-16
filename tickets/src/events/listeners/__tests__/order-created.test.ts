import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Events } from "@encuentradepa/common";

import { OrderCreated } from "../order-created";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models";

const setup = async () => {
  // @ts-ignore
  const message: Message = {
    getSequence: () => 1,
    ack: jest.fn(),
  };
  const listener = new OrderCreated(natsWrapper.client);
  const ticket = await Ticket.build({
    title: "Vetusta Morla",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  const data: Events.EventTypes.OrderCreated["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: Events.Status.OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: ticket._id,
      price: ticket.price,
    },
  };

  return { message, data, listener, ticket };
};

it("should update ticket with the right orderId", async () => {
  const {
    data,
    ticket: { _id },
    listener,
    message,
  } = await setup();

  await listener.onMessage(data, message);

  const ticket = await Ticket.findOne({ _id });

  expect(ticket).toHaveProperty("orderId");
  expect(String(ticket?.orderId)).toEqual(String(data.id));
});

it("should call the ack method if everything is works", async () => {
  const { data, listener, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it("should not call the ack method if we do not find the ticket", async () => {
  const {
    data: { ticket, ...order },
    listener,
    message,
  } = await setup();
  const unexistingTicket = {
    ...ticket,
    id: new mongoose.Types.ObjectId().toHexString(),
  };

  await listener.onMessage(
    {
      ...order,
      ticket: unexistingTicket,
    },
    message
  );

  expect(message.ack).not.toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { data, ticket, listener, message } = await setup();

  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // De esta manera le decimos a typescript que esto es una función mock y accedemos a sus datos.
  // El [0] representa la primera llamada a esa función mock.
  const [eventSubject, eventData] = (natsWrapper.client
    .publish as jest.Mock).mock.calls[0];
  const parsedEventData = JSON.parse(eventData);

  expect(eventSubject).toEqual(Events.Subjects.TicketUpdated);
  expect(String(parsedEventData.id)).toEqual(String(ticket._id));
  expect(parsedEventData.title).toEqual(ticket.title);
  expect(parsedEventData.price).toEqual(ticket.price);
  expect(String(parsedEventData.userId)).toEqual(String(ticket.userId));
  expect(String(parsedEventData.orderId)).toEqual(String(data.id));
  expect(parsedEventData.version).toEqual(ticket.version + 1);
});
