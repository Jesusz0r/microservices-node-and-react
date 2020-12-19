import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Events } from "@encuentradepa/common";

import { Ticket, Order } from "../../../models";
import { natsWrapper } from "../../../nats-wrapper";
import { Listeners } from "../..";

beforeEach(() => {
  jest.clearAllMocks();
});

const setup = async () => {
  // @ts-ignore
  const message: Message = {
    getSequence: () => 1,
    ack: jest.fn(),
  };
  const listener = new Listeners.ExpirationCompleted(natsWrapper.client);
  const ticket = await Ticket.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vetusta Morla",
    price: 10,
  });
  const order = await Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: Events.Status.OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  const data: Events.EventTypes.ExpirationCompleted["data"] = {
    orderId: order._id,
  };

  return { order, ticket, message, listener, data };
};

it("should succesfuly update order status to cancelled", async () => {
  const { data, order, message, listener } = await setup();

  await listener.onMessage(data, message);

  const updatedOrder = await Order.findOne({ _id: order._id });

  expect(updatedOrder!.status).toEqual(Events.Status.OrderStatus.Cancelled);
});

it("should succesfuly emit OrderCancelled event", async () => {
  const { data, order, message, listener } = await setup();

  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const [subject, eventData] = (natsWrapper.client
    .publish as jest.Mock).mock.calls[0];

  expect(subject).toEqual(Events.Subjects.OrderCancelled);
  expect(JSON.parse(eventData).id).toEqual(String(order._id));
});

it("should succesfuly call the ack method", async () => {
  const { data, message, listener } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
