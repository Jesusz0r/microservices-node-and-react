import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Events } from "@encuentradepa/common";

import { OrderCreated } from "../order-created";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models";

const setup = async () => {
  // @ts-ignore
  const message: Message = {
    getSequence: () => 1,
    ack: jest.fn(),
  };
  const listener = new OrderCreated(natsWrapper.client);
  const data: Events.Types.OrderCreated["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: Events.Status.Order.Created,
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
    },
  };

  return { message, data, listener };
};

it("should succesfuly create the order and call the ack method", async () => {
  const { data, listener, message } = await setup();

  await listener.onMessage(data, message);

  const order = await Order.findOne({ _id: data.id });

  expect(order).toHaveProperty("_id");
  expect(String(order!._id)).toEqual(String(data.id));
  expect(order).toHaveProperty("status");
  expect(order!.status).toEqual(Events.Status.Order.Created);
  expect(order).toHaveProperty("userId");
  expect(String(order!.userId)).toEqual(String(data.userId));
  expect(order).toHaveProperty("version");
  expect(order!.version).toEqual(data.version);
  expect(order).toHaveProperty("price");
  expect(order!.price).toEqual(data.ticket.price);
  expect(message.ack).toHaveBeenCalled();
});
