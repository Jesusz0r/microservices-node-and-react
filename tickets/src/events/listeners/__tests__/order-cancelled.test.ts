import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Events } from "@encuentradepa/common";

import { OrderCancelled } from "../order-cancelled";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models";

const setup = async () => {
  // @ts-ignore
  const message: Message = {
    getSequence: () => 1,
    ack: jest.fn(),
  };
  const listener = new OrderCancelled(natsWrapper.client);
  const ticket = await Ticket.build({
    title: "Vetusta Morla",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket.set("orderId", new mongoose.Types.ObjectId());

  await ticket.save();

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

it("should set the orderId property to undefined", async () => {
  const {
    message,
    data,
    listener,
    ticket: { _id, orderId },
  } = await setup();

  expect(orderId).not.toBeNull();

  await listener.onMessage(data, message);

  const ticket = await Ticket.findOne({ _id });

  expect(ticket).toHaveProperty("orderId");
  expect(ticket?.orderId).toBeUndefined();
});

it("should ack the message", async () => {
  const { message, data, listener } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
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
  expect(parsedEventData.orderId).toBe("undefined");
  expect(parsedEventData.version).toEqual(ticket.version + 1);
});
